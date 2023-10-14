/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/\/_next\/static\/.*\.woff2/],
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAxiom } = require('next-axiom')

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
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

module.exports = withAxiom(withBundleAnalyzer(withPWA(nextConfig)))
