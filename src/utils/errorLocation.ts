const FRAME_REGEX =
    /at\s+(?:async\s+)?(?:(.+?)\s+)?\(?(.*?[/\\]src[/\\].*?):(\d+):\d+\)?/;
const SKIP_PATTERNS = [/node_modules/, /ReportActions\.ts/, /stepRunner\.ts/];

export function extractFirstProjectFrame(error: unknown) {
    const stack =
        (error instanceof Error ? error.stack : undefined) ?? String(error);
    const lines = stack.split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (SKIP_PATTERNS.some((pattern) => pattern.test(trimmed))) {
            continue;
        }

        const match = FRAME_REGEX.exec(trimmed);

        if (!match) {
            continue;
        }

        const [, fnName, fullPath, lineNo] = match;

        const fileName =
            fullPath.replace(/\\/g, "/").split("/").pop() ?? fullPath;

        const fn = fnName?.trim() || "<anonymous>";
        return `at ${fn} (${fileName}:${lineNo})`;
    }
    return "";
}

export function formatErrorForLog(error: unknown, context: string): string {
    const message = error instanceof Error ? error.message : String(error);
    const frame = extractFirstProjectFrame(error);
    const location = frame ? `[${frame}]` : "";
    return `[${context}] ${location}FAILED ${message}`;
}
