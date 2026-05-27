import { AsyncLocalStorage } from "node:async_hooks";

const storage = new AsyncLocalStorage<string[]>();

export function getCallStack(): string[] {
    return storage.getStore() ?? [];
}

export function pushMethod(name: string): void {
    const stack = getCallStack();
    if (stack.length < 15) {
        stack.push(name);
    }
}

export function popMethod(): void {
    getCallStack().pop();
}

export function getCallChainString(): string {
    const stack = getCallStack();
    if (stack.length === 0) {
        return "";
    }
    return stack.join(" -> ");
}

export function ensureChainContext<T>(fn: () => T): T {
    if (storage.getStore()) {
        return fn();
    }
    return storage.run([], fn);
}
