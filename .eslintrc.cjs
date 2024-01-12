module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "import", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "plugin:import/typescript",
    "airbnb-typescript/base",
    "eslint:recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
};
