// lint-staged.config.js
module.exports = {
    '*.{ts,js}': [
      'eslint --fix', // Run ESLint with auto-fix on TypeScript files
      'prettier --write', // Run Prettier to format code
    ],
  };