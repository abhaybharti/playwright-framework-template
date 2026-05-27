import { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import * as fs from "fs";
import * as path from "path";
import { logDebug, logError } from "@src/helper/logger/Logger";

interface FailedOrSkippedTest {
    file: string;
    line: number;
    title: string;
}

class FailedAndSkippedReporter implements Reporter {
    private failedAndSkippedTests: FailedOrSkippedTest[] = [];
    private skippedTestIds: string[] = [];

    onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === "failed") {
            this.failedAndSkippedTests.push({
                file: test.location.file,
                line: test.location.line,
                title: test.titlePath().join(" > "),
            });
        }

        if (result.status === "skipped") {
            this.failedAndSkippedTests.push({
                file: test.location.file,
                line: test.location.line,
                title: test.titlePath().join(" > "),
            });
            this.skippedTestIds.push(test.id);
        }
    }

    onEnd() {
        if (this.failedAndSkippedTests.length === 0) {
            logDebug("No failed or skipped tests found.");
            return;
        }
        const lastFailedPath = path.resolve(
            process.cwd(),
            ".last-failed-tests"
        );
        const lines = this.failedAndSkippedTests.map(
            (test) => `${test.file}:${test.line}:${test.title}`
        );

        fs.writeFileSync(lastFailedPath, lines.join("\n"), "utf-8");
        logDebug(
            `\n[FailedAndSkippedReporter] Updated .last-failed-tests with ${lines.length} failed/skipped test(s).`
        );
    }

    async onExit() {
        if (this.skippedTestIds.length === 0) {
            return;
        }

        const lastRunPath = path.join(
            process.cwd(),
            "test-results",
            ".last-run.json"
        );

        if (!fs.existsSync(lastRunPath)) {
            return;
        }

        try {
            const raw = fs.readFileSync(lastRunPath, "utf-8");
            const lastRunData: { status: string; failedTests: string[] } =
                JSON.parse(raw);
            const merged = new Set([
                ...lastRunData.failedTests,
                ...this.skippedTestIds,
            ]);
            lastRunData.failedTests = [...merged];
            fs.writeFileSync(
                lastRunPath,
                JSON.stringify(lastRunData, null, 2),
                "utf-8"
            );
            logDebug(
                `[FailedAndSkippedReporter] merged ${this.skippedTestIds.length} skipped test(s) into .last-run.json (total failedTests: ${lastRunData.failedTests.length}.`
            );
        } catch (err) {
            logError(
                `[FailedAndSkippedReporter] Error occurred while updating .last-run.json: ${err}`
            );
        }
    }
}

export default FailedAndSkippedReporter;
