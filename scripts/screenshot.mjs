import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

import config from "./screenshot.config.mjs";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function spawnDevServer() {
  const child = spawn("npx", ["next", "dev"], {
    cwd: projectRoot,
    env: { ...process.env, SCREENSHOT: "1" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  const baseUrl = new Promise((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for dev server output:\n${buffer}`));
    }, 30000);

    function cleanup() {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
      child.off("exit", onExit);
    }

    function onData(chunk) {
      buffer += chunk.toString();
      const local = buffer.match(/Local:\s+(http:\/\/localhost:\d+)/);
      if (local) {
        cleanup();
        resolve(local[1]);
      }
    }

    function onExit(code) {
      cleanup();
      reject(new Error(`Dev server exited with code ${code}:\n${buffer}`));
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", onExit);
    child.on("error", (err) => {
      cleanup();
      reject(err);
    });
  });

  return { child, baseUrl };
}

async function waitForPage(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message}`);
}

function snapshotFiles(names) {
  const saved = names.map((name) => {
    const file = path.join(projectRoot, name);
    return [file, fs.existsSync(file) ? fs.readFileSync(file) : null];
  });
  return () => {
    for (const [file, contents] of saved) {
      if (contents) fs.writeFileSync(file, contents);
    }
  };
}

function stopDevServer(child) {
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    // already exited
  }
}

async function main() {
  const restoreFiles = snapshotFiles(["tsconfig.json", "next-env.d.ts"]);
  const { child, baseUrl: baseUrlPromise } = spawnDevServer();
  try {
    const baseUrl = await baseUrlPromise;
    await waitForPage(`${baseUrl}${config.path}`);
    await takeScreenshots(baseUrl);
  } finally {
    stopDevServer(child);
    restoreFiles();
  }
}

async function takeScreenshots(baseUrl) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: config.viewport,
    });

    await page.addInitScript(
      ({ storageKey, checkedKm }) => {
        // Must match the cache keys exactly, or getTrips falls back to the API
        const home = "7816 Rue Berri";
        window.localStorage.setItem("homeAddress", home);
        window.localStorage.setItem(
          "directionsCache",
          JSON.stringify({
            geocode: { [home]: [45.5417867, -73.6245768] },
            trips: {
              [`${home}|50.75056,-75.12572`]: { km: 840.894, seconds: 45108 },
              [`${home}|51.185706,-77.4663324`]: { km: 938.52, seconds: 39166 },
              [`${home}|51.489391,-78.7503737`]: {
                km: 1047.226,
                seconds: 45258,
              },
            },
          }),
        );
        const checked = Object.fromEntries(checkedKm.map((km) => [km, true]));
        window.localStorage.setItem(storageKey, JSON.stringify(checked));
      },
      {
        storageKey: `checked:${config.path.slice(1)}`,
        checkedKm: config.checkedKm,
      },
    );

    await page.goto(`${baseUrl}${config.path}`, { waitUntil: "networkidle" });

    await page.waitForTimeout(700);

    await page.evaluate((y) => window.scrollTo(0, y), config.scrollY);
    await page.waitForTimeout(700);

    for (const scheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.waitForTimeout(100);
      const outputPath = path.join(projectRoot, config.outputPath[scheme]);
      await page.screenshot({ path: outputPath });
      console.log(`Saved screenshot to ${config.outputPath[scheme]}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
