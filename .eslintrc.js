module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 0,
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'no-var': 2,
    'prefer-const': 2,
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'no-return-await': 'off'
  }
}
