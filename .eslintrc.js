module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "import", "prettier"],
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "plugin:import/typescript",
    "eslint:recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
};
