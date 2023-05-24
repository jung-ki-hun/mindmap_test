module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:prettier/recommended', 'eslint:recommended', 'plugin:vue/recommended', '@vue/standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 120,
        bracketSpacing: true,
        arrowParens: 'avoid'
      }
    ],
    camelcase: 'off',
    'vue/no-v-html': 'error',
    'vue/prop-name-casing': 'off',
    'vue/html-self-closing': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
