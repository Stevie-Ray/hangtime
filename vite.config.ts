import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA, ManifestOptions } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
// import VueDevTools from 'vite-plugin-vue-devtools'

// Utilities
import manifest from './manifest.json' assert { type: 'json' }
const manifestTyped = manifest as Partial<ManifestOptions>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      autoImport: true
      // styles: {
      //   configFile: 'src/plugins/vuetify/settings.scss'
      // }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      injectRegister: null, // register the service workbox manually
      srcDir: 'public', // .
      filename: 'service-worker.js',
      manifest: manifestTyped,
      workbox: {
        globPatterns: ['**/*.{js,css}'],
        navigateFallback: null
      },
      devOptions: {
        enabled: false,
        type: 'module'
      }
    }),
    visualizer({
      open: true
    })
    // VueDevTools()
  ],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  server: {
    port: 3000
  },
  esbuild: {
    legalComments: 'none'
  }
})
