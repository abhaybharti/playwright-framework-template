import { StepRunner } from "../stepRunner";
import { logError } from "@src/helper/logger/Logger";

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

        descriptor.value = async function (...args: any[]) {
            const title =
                replacePlaceholders(stepTitle, args) || (propertyKey as string);
            const argsStr = args.map(formatArg).join(", ");
            const fullTitle = argsStr ? `${title} | (${argsStr})` : title;
            return await StepRunner.run(fullTitle, async () =>
                originalMethod.apply(this, args)
            );
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
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            } catch (error) {
                logError(
                    `Error in ${methodName} with args ${args.map(formatArg).join(", ")} : ${error instanceof Error ? error.stack : String(error)}`
                );
                throw error;
            }
        };
        return descriptor;
    };
}
