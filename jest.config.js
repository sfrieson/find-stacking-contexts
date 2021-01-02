module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      statements: 100,
      branches: 100,
    },
  },
  testEnvironment: "node",
};
