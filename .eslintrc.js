module.exports = {
  extends: ['eslint:recommended', 'standard', 'plugin:react/recommended'],
  env: {
    browser: true
  },
  rules: {
    'react/display-name': 0,
    'react/prop-types': 0,
    'space-before-function-paren': 0
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.12.0'
    }
  }
}
