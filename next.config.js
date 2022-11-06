/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {
    SAME_SERVER: process.env.SAME_SERVER,
    PROVIDER_SERVER: process.env.PROVIDER_SERVER,
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
}
module.exports = nextConfig
