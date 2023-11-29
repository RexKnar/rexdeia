module.exports = {
  root: false,
  // extends: ['eslint:recommended', 'next', 'turbo', 'plugin:react/recommended'],
  extends: ['eslint:recommended', 'next', 'turbo'],
  plugins: [
    '@typescript-eslint',
    'small-import',
    'simple-import-sort',
    'import',
    'prettier',
    'react',
  ],
  rules: {
    // Base rules
    'prefer-let/prefer-let': 0,
    'prettier/prettier': 'error',

    // Console rules
    'no-alert': 'error',
    'no-debugger': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Import related rules
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-namespace': 'error',

    'small-import/no-full-import': 'error',

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],

    // React rules
    'react/jsx-no-useless-fragment': 'error',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  ignorePatterns: ['db.ts', 'next.config.js', 'next-env.d.ts', 'public/*'],
};
