import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prettierConfig = {
  semi: true,
  tabWidth: 4,
  useTabs: false,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'preserve',
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = [
  {
    ignores: ['node_modules', 'dist', 'playwright-report', 'test-results'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      playwright,
    },
    rules: {
      ...(tseslint.configs.recommended?.rules ?? {}),
      ...(playwright.configs['flat/recommended']?.rules ?? {}),
      'prettier/prettier': ['error', prettierConfig],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-skipped-test': 'error',
    },
  },
];

export default config;
