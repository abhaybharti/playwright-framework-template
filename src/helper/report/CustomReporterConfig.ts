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
import { logError, logInfo } from "../logger/Logger";

interface TestResultData {
    testCase: string;
    status: string;
    duration: number;
    error?: string;
}

export default class CustomReporterConfig implements Reporter {
    private curreentTestNumber: number = 0;
    private totalTests: number = 0;
    private testResults: TestResultData[] = [];
    private testStartTime: number = 0;

    constructor(options: { customOption?: string } = {}) {
        logInfo(`playwright-framework-template ${options.customOption}`);
    }

    onBegin(config: FullConfig, suite: Suite): void {
        this.totalTests = suite.allTests().length;
        this.testStartTime = Date.now();
        this.curreentTestNumber = 0;
        this.testResults = [];
        logInfo(
            `info`,
            `Test Suite Execution Started : ${suite.title} , Total Test : ${suite.allTests().length} tests`
        );
    }
    onTestBegin(test: TestCase): void {
        this.curreentTestNumber++;
        logInfo(
            `info`,
            `Test Case Started [${this.curreentTestNumber}/${this.totalTests}]: ${test.title}`
        );
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        logInfo(
            `info`,
            `Test Case Completed : ${test.title} Status : ${result.status}`
        );
        this.testResults.push({
            testCase: test.title,
            status: result.status,
            duration: result.duration,
            error: result.error ? result.error.message : undefined,
        });
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            logInfo(`info`, `Executing Step : ${step.title}`);
        }
    }

    onError(error: TestError): void {
        logError(`TestError :  ${error.message}`);
    }

    onEnd(result: FullResult): void | Promise<
        | void
        | {
              status?:
                  | "passed"
                  | "failed"
                  | "timedout"
                  | "interrupted"
                  | undefined;
          }
        | undefined
    > {
        const totalExecutionTime = Date.now() - this.testStartTime;
        logInfo(`Test Suite Execution Completed : ${result.status}`);

        //Add code to send result over email
    }
}
