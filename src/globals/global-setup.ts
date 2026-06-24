import { logDebug, logError } from "@src/helper/logger/Logger";
import { extractFirstProjectFrame } from "@src/utils/errorLocation";
import {validateReportConfig} from "@src/utils/report/reportPaths";
import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

function registerProcessErrorHandlers(): void {
    process.on("unhandledRejection", (reason: unknown) => {
        const frame = extractFirstProjectFrame(reason);
        const message =
            reason instanceof Error ? reason.message : String(reason);
        const stack = reason instanceof Error ? reason.stack : undefined;
        logError(
            `[UnhandledRejection]: ${message}` +
                (frame ? ` | location: ${frame}` : "") +
                ` | Hint: Check that all imported module-level constansts are defined and required env vars are set.`,
            { stack, frame }
        );
    });

    process.on("uncaughtException", (error: Error) => {
        const frame = extractFirstProjectFrame(error);
        logError(
            `[UncaughtException]: ${error.message}` +
                (frame ? ` | location: ${frame}` : "") +
                ` | Hint: An unhandled exception crashes the process. Check the stack trace below`,
            { stack: error.stack, frame }
        );
    }
}
export default function globalSetup() {
    registerProcessErrorHandlers();
    validateReportConfig();
    const logDir = "logs";
    try {
        const files = readdirSync(logDir).filter((file) =>
            file.endsWith(".log")
        );
        for (const file of files) {
            unlinkSync(join(logDir, file));
        }
        if (files.length > 0) {
            logDebug(
                `Deleted ${files.length} log file${files.length > 1 ? "s" : ""}.`
            );
        }
    } catch {}
}
