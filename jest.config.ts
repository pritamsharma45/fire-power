/** @type {import('ts-jest').JestConfigWithTsJest} */
export default   {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '<rootDir>/bower_components/',
    '<rootDir>/node_modules/',
  ],
  // setupFilesAfterEnv: [
  //   "@testing-library/jest-dom/extend-expect"
  // ]
};