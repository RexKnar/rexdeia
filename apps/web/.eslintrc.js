module.exports = {
  root: false,
  extends: ['next', 'turbo', 'prettier'],
  plugins: ['small-import', 'simple-import-sort', 'import'],
  rules: {
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
};
