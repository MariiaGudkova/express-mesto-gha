module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [],
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': [
      'error', {
        allow: [
          '_id',
        ],
      },
    ],
  },
};
