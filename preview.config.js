const path = require('path')

/** @type {import("@previewjs/config").PreviewConfig} */
module.exports = {
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  }
}
