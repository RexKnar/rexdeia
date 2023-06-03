/* eslint-env node */

module.exports = {
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    endOfLine: 'auto',
    plugins: [
      require.resolve('prettier-plugin-packagejson'),
      require.resolve('prettier-plugin-tailwindcss'),
    ],
  };