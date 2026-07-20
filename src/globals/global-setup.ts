import { logDebug, logError } from "@src/helper/logger/Logger";
import { extractFirstProjectFrame } from "@src/utils/errorLocation";
import {validateReportConfig} from "@src/utils/report/reportPaths";
import { readdirSync, statSync, unlinkSync } from "node:fs";
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
    pruneOldReportFiles(logDir,5);
}

function pruneOldReportFiles(logsDir: string, maxReports: number): void {
    const TIMESTAMP_PATTERN = /(\d{2})_(\d{2})_(\d{4})_(\d{2})(\d{2})(\d{2})/;

    let entries:string[];
    try{
        entries = readdirSync(logsDir)
    }catch (error) {
        logError(`Failed to read directory ${logsDir}: ${error}`);
        return;
    }

    const reportFiles = entries.filter((fileName) => {
        if (!fileName.endsWith("playwright-report-")) return false;

        try{
            return statSync(join(logsDir, fileName)).isDirectory();
        }
        catch (error) {
            logError(`Failed to stat file ${fileName}: ${error}`);
            return false;
        }
    });

    if (reportFiles.length <= maxReports) {
        return;
    }

    const withTimestamps = reportFiles.map((fileName) => {
        const match = fileName.match(TIMESTAMP_PATTERN);
        if (!match) return null;
        const [,dd,mm,yyyy,hh,min,ss] = match;
        const timestamp = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), Number(ss)).getTime();
        return { file: fileName, timestamp };
    }).filter((entry): entry is { file: string; timestamp: number } => entry !== null);


    //Sort descending - newest first
    withTimestamps.sort((a, b) => b.timestamp - a.timestamp);

    const filesToDelete = withTimestamps.slice(maxReports);

    for (const { file } of filesToDelete) {
        try {
            const filePath = join(logsDir, file);
            unlinkSync(filePath);
            logDebug(`Deleted old report file: ${filePath}`);
        } catch (error) {
            logError(`Failed to delete old report file ${file}: ${error}`);
        }
    }

}
