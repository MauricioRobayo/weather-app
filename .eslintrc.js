module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-shadow': 0,
    'no-param-reassign': 0,
    'eol-last': 0,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
  },
}
