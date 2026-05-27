import { logDebug } from "@src/helper/logger/Logger";
import { readdirSync, unlinkSync } from "fs";
import { join } from "node:path";
export default function globalSetup() {
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
