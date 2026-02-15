module.exports = {
  noInlineConfig: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: require('path').resolve(__dirname, 'tsconfig.json'),
  },

  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],

  plugins: ['@typescript-eslint', 'import', 'unicorn', 'prettier'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'unicorn/no-null': 'off',
    // Because the API requires using 'null':
    // https://github.com/rolling-scopes-school/fun-chat-server/tree/main#:~:text=USER_ACTIVE%22%2C%0A%20%20payload%3A-,null,-%2C%0A%7D

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.spec.js',
          '**/webpack.config.js',
          '**/eslint.config.js',
          '**/.eslintrc.cjs',
        ],
      },
    ],
  },

  ignorePatterns: [
    'dist/**',
    'build/**',
    'node_modules/**',
    '**/*.bundle.js',
    '**/*.bundle.css',
    'coverage/**',
    '*.log',
    'webpack.*.js',
    '.eslintrc.cjs',
    '.prettierrc.cjs',
  ],
};
