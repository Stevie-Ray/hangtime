const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin // eslint-disable-line
const PrerenderSPAPlugin = require('prerender-spa-plugin') // eslint-disable-line

const prerenderedRoutesList = ['/login', '/']

module.exports = {
  configureWebpack: {
    plugins: [
      /* Refer to https://github.com/moment/moment/issues/2416 Removes locales of moment.js (chart.js) */
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      /* Refer to https://www.npmjs.com/package/webpack-bundle-analyzer for more details */
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true
      }),
      /* See https://github.com/chrisvfritz/prerender-spa-plugin for more details */
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__rootDirname),
        // Required - Routes to prerender.
        routes: prerenderedRoutesList
      })
    ]
  }
}
