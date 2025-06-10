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
import {logInfo} from './Logger'

export default class CustomReporterConfig implements Reporter {
  constructor(options: { customOption?: string } = {}) {
    logInfo(`playwright-framework-template ${options.customOption}`);
  }

  onBegin(config: FullConfig, suite: Suite): void {
    logInfo(`info`,
      `Test Suite Started : ${suite.title} , ${suite.allTests().length} tests`
    );
  }
  onTestBegin(test: TestCase): void {
    logInfo(`info`,`Test Case Started : ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    logInfo(`info`,`Test Case Completed : ${test.title} Status : ${result.status}`);
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === `test.step`) {
      logInfo(`info`,`Executing Step : ${step.title}`);
    }
  }

  onError(error: TestError): void {
    logInfo(`error`,`TestError :  ${error.message}`);
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
