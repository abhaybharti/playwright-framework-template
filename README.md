<h1 text-align="center">Playwright-Framework-Template</h1>

## Introduction

Playwright-Framework-Template - This project is based on Microsoft Playwright, Appium, Artillery which enables reliable end-to-end testing, Web testing, API testing, Mobile testing, load testing. It is a single unified for your entire testing suite : UI, API, Mobile, Load testing.

_☝ If you liked the project, please give a ⭐ on [GitHub](https://github.com/abhaybharti/playwright-framework-template). It will motivate me to add more such project._

\_☝ If you want new feature to be added or you believe you've encountered a bug [Open an issue] (https://github.com/abhaybharti/playwright-framework-template/issues) .

## Core capabilites
- **Cross-Browser Testing**: Chromium, Firefox,WebKit, Edge
- **Multipel Test Types**: UI, API, Mobile, Load Testing, Visual Testing
- **Page Object Model**: Scalable & maintainable test architecture
- **JSON Config**: Build script 
- **Dependency Injection**: Custom Fixtures, TypeScript Decorators for clean test & function code
- **Comprehenisve Reporting**: HTML, Log file, Video, Trace, Screenshot, 
- **Capture API**: HTML, Log file, Video, Trace, Screenshot, 



## Features

- Easy to Configure
- Auto wait for all elements & checks
- Generate HTML report
- Generate detailed trace file which helps to debug
- Generate snapshot for each step
- Record video for test case execution
- Support Web automation with support for chrome, Edge, Firefox and Safari
- Support Mobile automation with support for Android native, web and hybrid apps automation
- Support iOS native, web and hybrid apps automation
- Support execution of Web tests on Microsoft Azure (can scale on demand)
- Support API testing (GET, POST, PUT, DELETE HTTP methods)
- Dynamic data handling using external JSON files
- Support taking screenshots
- Run functional test for load testing using Artillery
- Support Serial and Parallel execution
- Environment configuration using .env files

## Tech Stack/Libraries Used

- [PlayWright](https://playwright.dev/) - for web/API automation/Mobile Device Emulation Testing
- [Artillery](https://www.artillery.io/) - for load testing
- [Appium](https://appium.io/docs/en/2.4/) - for mobile app automation
- [ESLint](https://eslint.org/) - pinpoint issues and guide you in rectifying potential problems in both JavaScript and TypeScript.
- [Prettier](https://prettier.io/) - for formatting code & maintain consistent style throughout codebase
- [Dotenv](https://www.dotenv.org/) - to load environment variables from .env file
- [Secrets](https://github.com/du5rte/secrets) - to load secrets from AWS Secrets Manager
- [TypeScript](https://www.typescriptlang.org/) - for type safety
- [Joi](https://github.com/sideway/joi) - for data validation
- [Moment](https://momentjs.com/) - for date & time handling
- [Winston](https://github.com/winstonjs/winston) - for logging
- [Mocha](https://mochajs.org/) - for test runner
- [Chai](https://www.chaijs.com/) - for assertion



## Getting Started

## Project Structure
```text
playwright-framework-template/
├── .github/workflows/                   # GitHub Actions CI/CD
├── src/
|   └── helper/                          # Helpers
|   |       ├── api/apiHelper.ts         # API Helper
|   |       ├── load/loadHelper.ts       # Load testing Helper
|   |       ├── mobile/mobileHelper.ts   # Mobile action Helper
|   |       └── web/webHelper.ts         # Web action Helper
|   └── utils/                           # Utilities
|   |       ├── config/                  # config files
|   |       ├── error/                   # Centralized error manager
|   |       ├── reader/                  # JSON/Excel reader Helper
|   |       ├── report/                  # Custom report manager
|   |       └── other/                   # Har Analyzer
|   └── globals/                         # Global setup/teardown/healthcheck scripts
├── tests/ 
|     ├── fixtures/                      # Custom test fixtures
|     ├── api/                           # API Integration tests
|     |    └── example/                  # example api tests
|     ├── e2e/                           # E2E tets
|     |    └── example/                  # example e2e tests
|     ├── load/                          # Load testing
|     |    └── example/                  # example load tests
|     ├── resources/                     # resource files
|     ├── web/                           # browser tests
|     |    └── example/                  # example web tests
|     └── mobile/                        # Mobile tests
|          └── example/                  # example mobile tests
├── Dockerfile                           # Dockerfile
├── docker-compose.yml                   # docker-compose.yml
├── .env                                 # environment variables
├── .env.example                         # environment variables example
├── .gitignore                           # git ignore
├── .prettierrc                          # prettier config
├── .eslintrc.json                       # eslint config
├── package.json                         # package.json
├── playwright.config.ts                 # playwright config
├── README.md                            # README.md
└── tsconfig.json                        # tsconfig.json


### Prerequisite

- `nodejs`: Download and install Node JS from
  > `https://nodejs.org/en/download`
- `Visual Studio Code/WindSurf/Cursor`: Download and install code editor
- `Git`

### Installation

- clone the repo using below URL

  > `https://github.com/abhaybharti/playwright-framework-template.git`

- Navigate to folder and install dependencies

  > `npm install`

- For first time installation use below command to download & install required browsers:

  > `npx playwright install`

- In case you want to do fresh setup of playwright
  - Create a folder & run command `npm init playwright@latest`
  - select `TypeScript` & select default for other options


## Usage

- For browser configuration, change required parameters in playwright.config.ts
- To run your suite on MS Azure, copy the below code in `azure-pipeline.yml` and `playwright.service.config.ts` to root folder, update following key & run your suite
  - PLAYWRIGHT_SERVICE_ACCESS_TOKEN
  - PLAYWRIGHT_SERVICE_URL=XXX

## How to generate Playwright code (Playwright Test Generator)

- run command `npx playwright codegen`
- Browser gets opened & navigate to web app & perform test actions

Playwright test generator generates tests and pick locator for you. It uses role,text and test ID locators.

To pick a locator, run the `codegen` command followed by URL, `npx playwright codegen https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`

## Writing Tests

- Create test files in `src/tests` folder

## Sample Test

### Unit/Integration Testing

### Sample Web Test

> Note: Refer to [sample-web-test](https://github.com/abhaybharti/playwright-framework-template/tree/master/src/tests/web/example)

Pls go through different `\*.ts` file, which has tests example for different purpose.

#### Locator Example

> Note: Refer to [sample-web-test](https://github.com/abhaybharti/playwright-framework-template/tree/master/src/tests/web/example/locator.spec.ts)

### Sample Web Load Test

### Sample Api Test

> Note: Refer to [sample-api-test](https://github.com/abhaybharti/playwright-framework-template/tree/master/src/tests/api/example)

Pls go through different `\*.ts` files, which has tests example for different api tests.

### Sample API Load Test

### Sample Mobile Test

## Run Test

### To Run Web Test

- `npx playwright test (name-of-file.spec.ts) --headed` to run test in ui mode
- `npx playwright test (name-of-file.spec.ts) --headed --config=playwright.config.chrome.ts` to run test in ui mode on chrome browser
- `npx playwright test (name-of-file.spec.ts) --headed --config=playwright.config.firefox.ts` to run test in ui mode on firefox browser
- `npx playwright test (name-of-file.spec.ts) --headed --config=playwright.config.edge.ts` to run test in ui mode on edge browser

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

### Best Practices in Test Authoring:

- `Create isolated test cases`: Each test case should be independent.
- `Write Meaningful Test Case Titles`: Make your test case titles descriptive and meaningful.
- `Follow the AAA (Arrange-Act-Assert) Pattern`: Align your Test-Driven Development (TDD) approach with the clarity of Arrange, Act, and Assert.
- `Maintain Cleanliness`: Separate additional logic from tests for a tidy and focused codebase.

## GitHub Actions - created workflow to run test

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/abhaybharti/playwright-framework-template/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/abhaybharti/playwright-framework-template/pulls) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/abhaybharti/playwright-framework-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=abhaybharti/playwright-framework-template" />
</a>


g