module.exports = {
  plugins: ['lodash'],
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ],
    '@babel/preset-env',
    '@babel/preset-react'
  ]
}
