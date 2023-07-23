/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', { excluded: [] }]],
    serverActions: true,
  },
}

module.exports = nextConfig
