module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: "./tsconfig.json",
    createDefaultProgram: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  env: {
    node: true,
    browser: true
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "require-atomic-updates": 0
  }
};
