/* eslint-env node */

/** @type {import("prettier").Options} */
module.exports = {
  semi: true,
  tabWidth: 2,
  printWidth: 80,
  endOfLine: 'auto',
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
};
