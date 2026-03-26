import { test } from '@playwright/test';

export class StepRunner {
    static async run<T>(title: string, fn: () => Promise<T>): Promise<T> {
        return await test.step(title, async () => {
            return await fn();
        });
    }
}