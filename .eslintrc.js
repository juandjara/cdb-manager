module.exports = {
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    jest: true
  },
  plugins: ['react', 'prettier'],
  extends: ['prettier', 'react-app'],
  rules: {
    'prettier/prettier': 'error',
    'no-unreachable': 'error',
    'no-console': 'error'
  }
}
