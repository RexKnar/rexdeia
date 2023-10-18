module.exports = {
  root: false,
  extends: [
    'eslint:recommended',
    'next',
    'turbo',
    'plugin:deprecation/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'small-import',
    'simple-import-sort',
    'import',
    'prettier',
  ],
  rules: {
    // Base rules
    'prefer-let/prefer-let': 0,
    'prettier/prettier': 'error',

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
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  ignorePatterns: ['db.ts', 'next.config.js', 'next-env.d.ts', 'public/*'],
};
