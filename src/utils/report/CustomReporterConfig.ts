import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";
const winston = require(`winston`);

const console = new winston.transports.Console();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // - Write all logs with importance level of `info` or less than it
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),
  ],
});

// Writes logs to console
logger.add(console);

export default class CustomReporterConfig implements Reporter {
  constructor(options: { customOption?: string } = {}) {
    console.log(`playwright-framework-template ${options.customOption}`);
  }

  onBegin(config: FullConfig, suite: Suite): void {
    logger.info(
      `Test Suite Started : ${suite.title} , ${suite.allTests().length} tests`
    );
  }
  onTestBegin(test: TestCase): void {
    logger.info(`Test Case Started : ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    logger.info(
      `Test Case Completed : ${test.title} Status : ${result.status}`
    );
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === `test.step`) {
      logger.info(`Executing Step : ${step.title}`);
    }
  }

  onError(error: TestError): void {
    logger.error("TestError : ", error.message);
  }

  onEnd(
    result: FullResult
  ): void | Promise<
    | void
    | { status?: "passed" | "failed" | "timedout" | "interrupted" | undefined }
    | undefined
  > {
    console.log(`Test Suite Completed : ${result.status}`);
  }
}
