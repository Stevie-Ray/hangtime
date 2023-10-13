const { defineConfig } = require('@vue/cli-service')

// get version from package.json
process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = defineConfig({
  transpileDependencies: true,
  /* See https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa for more details */
  pwa: {
    themeColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './public/service-worker.js'
    }
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
    i18n: {
      locale: 'en-US',
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableInSFC: true
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  configureWebpack: {
    performance: {
      hints: false,
      maxEntrypointSize: 1024000,
      maxAssetSize: 1024000
    },
    optimization: {
      splitChunks: {
        minSize: 17000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '_',
        enforceSizeThreshold: 30000,
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            priority: -5,
            reuseExistingChunk: true,
            chunks: 'initial',
            name: 'common_app',
            minSize: 0
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          // we are opting out of defaultVendors, so rest of the node modules will be part of default cacheGroup
          defaultVendors: false,
          vuePackage: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vue-i18n|pinia)[\\/]/,
            name: 'vendor_vue',
            chunks: 'all',
            priority: 10
          }
        }
      }
    }
  }
})
