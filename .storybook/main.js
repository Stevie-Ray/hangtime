const path = require('path')

module.exports = {
  stories: [
      '../src/**/*.stories.mdx',
      '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/preset-scss'
  ],
  webpackFinal: async (config) => {
    // to import { storyFactory } from '~storybook/util/helpers'
    config.resolve.alias['~storybook'] = path.resolve(__dirname)
    // the @ alias points to the `src/` directory, a common alias
    config.resolve.alias['@'] = path.resolve(__dirname, '..', 'src')
    // return the updated Storybook configuration
    return config
  },
  refs: {
    storybook: {
      title: 'DEMO',
      url: 'https://5ccbc373887ca40020446347-yldsqjoxzb.chromatic.com'
    }
  }
}
