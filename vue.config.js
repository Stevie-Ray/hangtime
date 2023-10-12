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
        chunks: 'all',
        minSize: 15000,
        maxSize: 250000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000
      }
    }
  }
})
