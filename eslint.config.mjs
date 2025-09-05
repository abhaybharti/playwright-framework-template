// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  // Use recommendedTypeChecked for rules requiring type information
  ...tseslint.configs.recommendedTypeChecked,
  {
    // Configure language options for type checking
    languageOptions: {
      parserOptions: {
        project: true, // Use the tsconfig.json in the root
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      "@typescript-eslint/await-thenable" : "error",
    },
  },
  {
    // Optionally, ignore specific files/folders
    ignores: ['dist/**', 'node_modules/**', 'playwright.config.ts'], // Adjust as needed
  }
);