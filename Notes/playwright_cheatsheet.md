# Playwright

## Setup & Installation

- NodeJs
- Aqua/IntelliJ/Visual Studio Code
- @playwright/test package (`npm init playwright@latest`)

  - What is installed

        - playwright.config.ts
        - package.json
        - package-lock.json
        - tests/
            - example.spec.ts
        - tests-examples/
            - demo-todo-app.spec.ts

> ![NOTES] The `playwright.config.js/ts` is where you can add configuration for Playwright including modifying which browsers you would like to run Playwright on.

## Updating Playwright version

To update Playwright to the latest version run the following command:

```
npm install -D @playwright/test@latest

npx playwright install --with-deps
```

Check version of Playwright:

```
npx playwright --version
```

## How to run Example Test

`npx playwright test`

## How to run Example Test in UI mode

`npx playwright test --ui`

## How to see report

`npx playwright show-report`

## npm vs npx - what's the difference

## Why playwright

- supports JS/TS/Java/C#/Python
- Built by Microsoft
- Fast
- Parallel Execution
- Trace Viewer, Inspector, codegen, video

## npx playwright codegen

## run playwright test

## execution command

`npx playwright test` Runs the end-to-end tests.

`npx playwright test --ui` Starts the interactive UI mode.

`npx playwright test --project=chromium` Runs the tests only on Desktop Chrome.

`npx playwright test example` Runs the tests in a specific file.

`npx playwright test --debug` Runs the tests in debug mode.

`npx playwright codegen` Auto generate tests with Codegen.
