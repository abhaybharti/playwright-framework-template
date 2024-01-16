## Playwright-Framework-Template

Ultimate test automation for testing any application on any platform

> [!NOTE] Don't forget to \* the repository if you like it!

## Why was PlayWright-Framework-Template created?

In my career having vast experience in automating Api, Web Browsers and mobile apps, I have seen that people had to use different frameworks for automation Api, Web and Mobile applications which created a lot of chaos with respect to maintenance of dependencies and their respective code for test automation.

## Features

- Zero boilerplate code
- Support Rest Api automation with schema validations and response body verification
- Support Web automation with support for chrome, Edge, Firefox and Safari
- Support Mobile automation with support for Android native, web and hybrid apps automation
- Support iOS native, web and hybrid apps automation
- Support execution of Web tests on Microsoft Azure
- Support execution of Mobile tests on cloud platform like LambdaTest & BrowserStack
- Micro logging to log events of the test execution
- Support taking screenshots
- Supports Allure report generation
- Support running functional test for load testing using Artillery

## Libraries Used For Test

- PlayWright for web automation
- PlayWright for Api automation
- Artillery for load testing
- Allure for reporting
- Appium for mobile app automation

## Libraries Used For Code Consistency

- `ESLint` it's a linting tool, designed to analyze your code, pinpoint issues and guide you in rectifying potential problems in both JavaScript and TypeScript.
- `Prettier` is a tool for formatting code & maintain consistent style throughout codebase.

## Libraries Used For Enviornment Variable and Secrets

- `Dotenv` to load environment variables from .env file
- `Secrets` to load secrets from AWS Secrets Manager

## How to use

- clone repo
- run `npm install` command

## Sample Test

### Sample Web Test

`test('Navigate to Google @smoke', async({page}) => {     await page.goto('https://www.google.com/')     await expect(page).toHaveTitle('Google') })`

### Sample Web Load Test

### Sample Api Test

### Sample API Load Test

### Sample Mobile Test

## Run Test

### To Run Web Test

### To Run Api Test

### To Run Mobile Test

### To Run Test Multiple Times in Parallel

`npx playwright test --workers=5 --headed --repeat-each=5`

- This will run test 5 times, at a time 5 instance will run. `--workers=5` will run 5 instances

### To Run Test Multiple Times in Sequence

`npx playwright test --workers=1 --headed --repeat-each=5`

- This will run test 5 times, at a time single instance will run, `--repeat-each=5` will run 5 times

### To Run Load Test using Artillery & PlayWright Suite

`artillery run artillery-script.yml --output report.json`

### Grouping and Organizing Test Suite in PlayWright

`npx playwright test --grep @smoke` This will run only test tagged as @smoke

## Debug And Analyze

### View Trace Result of PlayWright Execution

- Open `https://trace.playwright.dev`
- Upload `trace.zip` file to above site, it will show trace details

### Run test in debug mode

`npx playwright test UIBasictest.spec.js --debug`

This will start running script in debug mode & open PlayWright inspector

### How to generate load test report using artillery + Playwright

`artillery report report.json --output report.html`

#### Run & Generate Report

### Further Reading

https://medium.com/@oroz.askarov/building-a-robust-automation-framework-in-playwright-typescript-version-b13be4e4bf56 https://github.com/alapanme/Playwright-Automation/blob/master/tests/2-checkBox.spec.ts
