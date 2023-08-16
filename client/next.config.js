/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // swcPlugins: [['next-superjson-plugin', { excluded: [] }]],
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: '/QxURPkM1WvVwiytseiF2WbP8GZc2',
        destination: '/8848af32-69d8-416c-a259-37e9c1582b8b',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
