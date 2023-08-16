import type { StorybookConfig } from '@storybook/nextjs'
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // '@chakra-ui/storybook-addon',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  env: (config) => {
    delete config.COOKIE_SECRET_CURRENT
    delete config.COOKIE_SECRET_PREVIOUS
    delete config.FIREBASE_PRIVATE_KEY

    return config
  },
  staticDirs: ['../public'],
  // features: {
  //   // @ts-ignore
  //   emotionAlias: false,
  // },
}
export default config
