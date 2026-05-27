import { StepRunner } from "../stepRunner";
import { formatErrorForLog } from "@src/utils/errorLocation";
import { logError, logInfo } from "@src/helper/logger/Logger";
import {
    pushMethod,
    popMethod,
    getCallChainString,
    ensureChainContext,
} from "@src/utils/callChain";

const MAX_LOG_STRING_LENGTH = 500;
const MAX_LOG_DEPTH = 3;
const MAX_LOG_ARRAY_ITEMS = 500;
const MAX_LOG_OBJECT_KEYS = 20;
const SENSITIVE_KEY_PATTERN =
    /(pass(word|wd)?|secret|token|api[-_]?key|authorization|cookie|session|credentials|private[-_]?key|access[-_]?key|refresh[-_]?token)/i;
const INTERNAL_KEY_PATTERN = /^_/;

function truncateString(
    value: string,
    maxLength: number = MAX_LOG_STRING_LENGTH
): string {
    if (value.length > maxLength) {
        return value;
    }
    return `${value.slice(0, maxLength)}...<truncated:${value.length}-maxLength>`;
}

function getStringProp(
    value: Record<string, unknown>,
    key: string
): string | undefined {
    const candidate = String(value[key]);
    if (typeof candidate === "string" && candidate.length > 0) {
        return truncateString(candidate);
    }
    return undefined;
}

function summarizePlaywrightObject(
    value: Record<string, unknown>
): Record<string, unknown> | null {
    const ctorName =
        typeof value.constructor.name === "string"
            ? value.constructor.name
            : "";
    const type = getStringProp(value, "_type") ?? ctorName;

    const locatorSelector = getStringProp(value, "_selector");
    if (type === "Locator" || locatorSelector) {
        return {
            type: "Locator",
            selector: truncateString(locatorSelector ?? "[unknown]"),
        };
    }

    const url = getStringProp(value, "_url") ?? getStringProp(value, "url");
    if (type === "Frame" && url) {
        return {
            type: "Frame",
            url: truncateString(url),
        };
    }

    if (type === "Page" && url) {
        return {
            type: "Page",
            url: truncateString(url),
        };
    }
    return null;
}

function serializeForLog(
    value: unknown,
    keyHint: string = "",
    depth: number = 0,
    seen: WeakSet<object> = new WeakSet<object>()
): unknown {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === "string") {
        return truncateString(value);
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    if (typeof value === "bigint") {
        return `${value.toString()}n`;
    }
    if (typeof value === "function") {
        const fnName =
            (value as (...args: unknown[]) => unknown).name || "anonymous";
        return `[Function: ${fnName}]`;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value instanceof Error) {
        return {
            name: value.name,
            message: truncateString(value.message),
            stack: truncateString(value.stack || ""),
        };
    }

    if (depth >= MAX_LOG_DEPTH) {
        const ctorName = (value as object).constructor?.name ?? "Object";
        return `[${ctorName}]`;
    }

    if (typeof value === "object") {
        const obj = value as object;
        if (seen.has(obj)) {
            return "[Circular]";
        }
        seen.add(obj);

        if (Array.isArray(value)) {
            return value
                .slice(0, MAX_LOG_ARRAY_ITEMS)
                .map((item) => serializeForLog(item, "", depth + 1, seen));
        }

        if (value instanceof Map) {
            const entries = Array.from(value.entries()).slice(
                0,
                MAX_LOG_OBJECT_KEYS
            );
            return entries.map(([k, v]) => [
                serializeForLog(k, "", depth + 1, seen),
                serializeForLog(v, "", depth + 1, seen),
            ]);
        }

        if (value instanceof Set) {
            return Array.from(value.values())
                .slice(0, MAX_LOG_ARRAY_ITEMS)
                .map((item) => serializeForLog(item, "", depth + 1, seen));
        }

        const summarizedPlaywrightObject = summarizePlaywrightObject(
            value as Record<string, unknown>
        );
        if (summarizedPlaywrightObject) {
            return summarizedPlaywrightObject;
        }

        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([key]) => !INTERNAL_KEY_PATTERN.test(key))
            .slice(0, MAX_LOG_OBJECT_KEYS);
        const result: Record<string, unknown> = {};

        for (const [key, rawVal] of entries) {
            if (
                SENSITIVE_KEY_PATTERN.test(key) ||
                INTERNAL_KEY_PATTERN.test(keyHint)
            ) {
                result[key] = "[REDACTED]";
            } else {
                result[key] = serializeForLog(rawVal, key, depth + 1, seen);
            }
        }
        return result;
    }
    return String(value);
}

function stringifyForLog(value: unknown): string {
    try {
        return JSON.stringify(serializeForLog(value));
    } catch (error) {
        return "[Unserializable]";
    }
}

function buildMethodName(label: string | undefined, fallback: string): string {
    if (label && label.trim().length > 0) {
        return label.trim();
    }
    return fallback;
}

async function runWithInstrumentation<T>({
    methodName,
    args,
    runner,
    stepTitle,
}: {
    methodName: string;
    args: unknown[];
    runner: () => Promise<T>;
    stepTitle?: string;
}) {
    const execute = async (): Promise<T> => {
        const start = Date.now();
        const argsSummary = stringifyForLog(args);
        logInfo(`[${methodName}] ENTER | args= ${argsSummary}`);
        pushMethod(methodName);
        try {
            const result = await runner();
            const duration = Date.now() - start;
            const resultSummary = stringifyForLog(result);
            logInfo(
                `[${methodName}] EXIT | duration=${duration}ms | return= ${stringifyForLog(result)}`
            );
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            if (!(error as any).__chainLogged) {
                const chain = getCallChainString();
                logError(
                    `[${methodName}] ERROR | callChain=[${chain}] |duration=${duration}ms | args= ${argsSummary} | ${formatErrorForLog(error, methodName)}`
                );
                (error as any).__chainLogged = true;
            }
            throw error;
        } finally {
            popMethod();
        }
    };

    if (stepTitle != null) {
        const title = replacePlaceholders(stepTitle, args) || methodName;
        const argsStr = args.map(formatArg).join(", ");
        const fullTitle = argsStr ? `${title} | (${argsStr})` : title;
        return await ensureChainContext(() =>
            StepRunner.run(fullTitle, execute)
        );
    }
    return await ensureChainContext(execute);
}

export function step(stepTitle: string) {
    return function (
        target: any,
        propertyKey: any,
        descriptor: PropertyDescriptor
    ): any {
        if (typeof propertyKey !== "object" && propertyKey !== "null") {
            const originalMethod = target as Function;
            const name = String(propertyKey.name ?? "");
            return async function (this: any, ...args: any[]) {
                const title = replacePlaceholders(stepTitle, args) || name;
                const argsStr = args.map(formatArg).join(", ");
                const fullTitle = argsStr ? `${title} | (${argsStr})` : title;
                return await StepRunner.run(fullTitle, async () =>
                    originalMethod.apply(this, args)
                );
            };
        }

        //Legacy  experimentalDecorators spec: propertyKey is string
        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(
                target,
                propertyKey as string
            );
        }

        if (!descriptor) {
            const value = target[propertyKey];
            descriptor = {
                value,
                writable: true,
                enumerable: false,
                configurable: true,
            };
        }
        const originalMethod = descriptor.value;
        if (typeof originalMethod !== "function") {
            return descriptor;
        }

        const methodName = buildMethodName(stepTitle, String(propertyKey));

        descriptor.value = async function (...args: any[]) {
            return await runWithInstrumentation({
                methodName,
                args,
                runner: () => originalMethod.apply(this, args),
                stepTitle,
            });
        };
        return descriptor;
    };
}

function replacePlaceholders(template: string, values: any[]): string {
    let result = template;
    let valueIndex = 0;
    result = result?.replace(/{[^}]*}/g, () => {
        if (valueIndex < values.length) {
            const value = values[valueIndex];
            valueIndex++;

            if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            ) {
                return String(value);
            } else if (value === null || value === undefined) {
                return String(value);
            } else if (typeof value === "object") {
                return JSON.stringify(value);
            }
        }
        return "";
    });

    return result;
}

function formatArg(arg: any): string {
    if (arg === null || arg === undefined) {
        return String(arg);
    }
    if (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean"
    ) {
        return String(arg);
    }

    if (typeof arg === "object") {
        try {
            return JSON.stringify(arg);
        } catch (error) {
            return `[${arg.constructor.name ?? "Object"}]`;
        }
    }

    return JSON.stringify(arg);
}

export function log(label?: string) {
    return function (
        target: any,
        propertyKey: any,
        descriptor: PropertyDescriptor
    ): any {
        if (typeof propertyKey !== "object" && propertyKey !== "null") {
            const originalMethod = target as Function;
            const methoName = label ?? String(propertyKey.name ?? "");
            return async function (this: any, ...args: any[]) {
                try {
                    const result = await originalMethod.apply(this, args);
                    return result;
                } catch (error) {
                    logError(
                        `Error in ${methoName} with args ${args.map(formatArg).join(", ")} : ${error instanceof Error ? error.stack : String(error)}`
                    );
                    throw error;
                }
            };
        }

        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(
                target,
                propertyKey as string
            );
        }

        if (!descriptor) {
            const value = target[propertyKey];
            descriptor = {
                value,
                writable: true,
                enumerable: false,
                configurable: true,
            };
        }

        const originalMethod = descriptor.value;
        const methodName = label ?? String(propertyKey);
        if (typeof originalMethod !== "function") {
            return descriptor;
        }

        descriptor.value = async function (...args: any[]) {
            return await runWithInstrumentation({
                methodName,
                args,
                runner: () => originalMethod.apply(this, args),
            });
        };
        return descriptor;
    };
}
