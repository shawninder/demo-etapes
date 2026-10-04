import type { NextConfig } from "next";

const screenshot = process.env.SCREENSHOT === "1";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  ...(screenshot && {
    distDir: ".next/screenshot",
    devIndicators: false,
  }),
};

export default nextConfig;
