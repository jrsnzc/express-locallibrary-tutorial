module.exports = {
  verbose: true,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/bdd/utils.js'
  ],
  testRegex: './__tests__/bdd/.*\\.[jt]sx?$',
};
