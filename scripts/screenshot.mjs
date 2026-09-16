import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

import config from "./screenshot.config.mjs";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function startDevServer() {
  const child = spawn("npx", ["next", "dev"], {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  return new Promise((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for dev server output:\n${buffer}`));
    }, 30000);

    function cleanup() {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
    }

    function onData(chunk) {
      buffer += chunk.toString();

      const existing = buffer.match(
        /existing server at (http:\/\/localhost:\d+)/,
      );
      if (existing) {
        cleanup();
        process.kill(-child.pid, "SIGTERM");
        resolve({ baseUrl: existing[1], ownServer: null });
        return;
      }

      const ready = buffer.match(/Local:\s+(http:\/\/localhost:\d+)/);
      if (ready && buffer.includes("Ready in")) {
        cleanup();
        resolve({ baseUrl: ready[1], ownServer: child });
      }
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("error", (err) => {
      cleanup();
      reject(err);
    });
  });
}

async function main() {
  const { baseUrl, ownServer } = await startDevServer();

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: config.viewport,
    });

    await page.addInitScript((checkedKm) => {
      const checked = Object.fromEntries(checkedKm.map((km) => [km, true]));
      window.localStorage.setItem("checked", JSON.stringify(checked));
    }, config.checkedKm);

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
    if (ownServer) {
      try {
        process.kill(-ownServer.pid, "SIGTERM");
      } catch {
        // already exited
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
