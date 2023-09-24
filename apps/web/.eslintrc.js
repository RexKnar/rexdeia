module.exports = {
  root: false,
  extends: ['next', 'turbo', 'eslint:recommended'],
  plugins: ['small-import', 'simple-import-sort', 'import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    // Import related rules
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-namespace': 'error',

    'small-import/no-full-import': 'error',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  ignorePatterns: ['db.ts', 'next.config.js', 'next-env.d.ts', 'public/*'],
};
