module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'mocha': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    '__REDUX_DEVTOOLS_EXTENSION__': true
  },
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'no-useless-escape': 'off',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'never']
  }
}
