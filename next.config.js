// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  typescript: {
    // set to false to fail build on type errors; set to true only if you need to bypass
    ignoreBuildErrors: false
  },
  // keep other defaults
};

module.exports = nextConfig;
