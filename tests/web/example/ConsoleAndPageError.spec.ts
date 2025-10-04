import { test} from "@tests/fixtures/test-options";
import { expect } from "@playwright/test";

// @ts-check // Enables type checking in JavaScript files, good practice for Playwright tests.
test

// Array to store console log messages of type 'error'.
const logs: {
    message: string;
    type: string;
}[] = []

// Array to store unhandled page errors (exceptions).
const errorMsg: {
    name: string,
    message: string
}[] = []

// Group tests related to error and console log checks.
test.describe('error and console log check', () => {

    // This block runs before each test in this describe block.
    test.beforeEach(async ({ page }) => {

        // --- Console Log Listener ---
        // Attaches an event listener for 'console' events on the page.
        page.on('console', (msg) => {
            // Filter and store only console messages of type 'error'.
            if (msg.type() == 'error') {
                logs.push({ message: msg.text(), type: msg.type() })
            }
        })

        // --- Page Error Listener ---
        // Attaches an event listener for unhandled 'pageerror' exceptions in the page's execution context.
        page.on('pageerror', (error) => {
            // Store the name and message of the unhandled error.
            errorMsg.push({ name: error.name, message: error.message })
        })

    })


    test('Check the exception and logs in console log', async ({ page }, testInfo) => {

        // Navigate to the target URL. This action will trigger the listeners
        // for any console errors or unhandled exceptions that occur during load.
        await page.goto('https://timesofindia.indiatimes.com/')


        // Format the collected console errors into a single string for attachment.
        const errorLogs = [...logs?.map(e => e.message)].join('\n')

        // If console errors were found, attach them to the test report for debugging.
        if (logs?.length > 0) {
            await testInfo.attach('console logs', {
                body: errorLogs.toString(),
                contentType: 'text/plain'
            })
        }

        // --- Assertions ---

        // Soft assertion: Checks if no console errors were logged.
        // The test continues if this fails, but it's marked as a failure.
        expect.soft(logs.length).toBe(0)
        
        // Hard assertion: Checks if no unhandled page errors/exceptions occurred.
        // The test fails immediately if this condition is not met.
        expect(errorMsg.length).toBe(0)

    })

})