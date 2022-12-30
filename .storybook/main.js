const path = require('path')
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
    'storybook-addon-vuetify3',
    {
      name: 'storybook-addon-sass-postcss',
      options: {
        rule: {
          test: /\.(scss|sass)$/i
        },
        sassLoaderOptions: {
          implementation: require('sass')
        }
      }
    }
  ],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-webpack5'
  },
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
