module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "import", "prettier", "playwright", "sonarjs","unicorn","jsdoc"],
  extends: [
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:playwright/playwright-test",
    "plugin:prettier/recommended",
    "plugin:unicorn/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2021,
    sourceType: "module"
  },
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".js", ".ts", ".ts"]
      }
    }
  },
  rules: {
    // Custom rules can go here
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc" }
    },
    ],
    "sonarjs/cognitive-complexity": ["error", 15], // Example: Limit function complexity
    "sonarjs/no-duplicate-string": "error", // Prevent duplicate strings,
    "unicorn/prevent-abbreviations": "off", // Customize: Disable abbreviation rule if too strict
    "unicorn/filename-case": [
      "error",
      { "case": "kebabCase" } // Enforce kebab-case for filenames
    ],
    "jsdoc/require-jsdoc": [
      "error",
      {
        "publicOnly": true, // Require JSDoc for exported/public functions
        "require": { "FunctionDeclaration": true, "ArrowFunctionExpression": false }
      }
    ],
    "jsdoc/require-param-description": "off", // Customize: Allow params without descriptions
    "jsdoc/require-returns": "error"
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.spec.ts", "**/*.spec.hs", "**/*.test.js"],
      extends: [
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:testing-library/react" // If using React
      ],
      rules: {
        // Test specific rules
        "jest/expect-expect": "error",
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    },
    // Playwright test files
    {
      files: ["**/tests/**/*.ts", "**/e2e/**/*.ts"],
      rules: {
        "jest/expect-expect": "off", // Disable for Playwright
        "jest/no-test-callback": "off",
        "jest/no-done-callback": "off"
      }
    }
  ]
};
