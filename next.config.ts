import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*']
}

export default nextConfig
