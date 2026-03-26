import {
    test as base,
    BrowserContext,
    Browser,
    Page,
    TestInfo,
    VideoMode,
    expect,
    request,
} from "@playwright/test";
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { pwApi } from "pw-api-plugin";
import { analyzeHAR } from "@src/utils/harAnalyser";
import { JsonReader } from "@src/utils/reader/jsonReader";
import { logInfo } from "@src/helper/logger/Logger";
import { testConfig } from "testConfig";

const urlPatternsToCapture = [/.*/];

const urlFilterRegex =
    urlPatternsToCapture.length > 0
        ? new RegExp(urlPatternsToCapture.join("|"), "i")
        : undefined;

// Initialize browser context with HAR recording
const initHarRecording = async (browser: Browser, testInfo: TestInfo) => {
    const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, "-");
    const harFilePath = `./test-results/${fileName}.har`;
    const newContext = await browser.newContext({
        viewport: null,
        recordHar: {
            path: harFilePath,
            mode: "full",
            ...(urlFilterRegex
                ? {
                      urlFilterRegex,
                  }
                : {}),
        },
        ...(testInfo.project.metadata?.video
            ? {
                  recordVideo: {
                      dir: testInfo.outputPath("videos"),
                  },
              }
            : {}),
    });
    return newContext;
};

// Teardown and save HAR file
const teardownHarRecording = async (
    page: Page,
    testInfo: TestInfo,
    videoMode: "on" | "off"
) => {
    const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, "-");
    const harFilePath = `./test-results/${fileName}.har`;
    const htmlFilePath = `./test-results/${fileName}.html`;

    if (videoMode === "on") {
        const videoPath = testInfo.outputPath("my-video.webm");
        await Promise.all([page.video()?.saveAs(videoPath), page.close()]);
        testInfo.attachments.push({
            name: "video",
            path: videoPath,
            contentType: "video/webm",
        });
    }

    await page.context().close({ reason: "Saving HAR file" });

    await analyzeHAR(harFilePath, htmlFilePath);

    await testInfo.attach("HAR File", {
        path: harFilePath,
        contentType: "application/json",
    });

    await testInfo.attach("Network Console", {
        path: `./test-results/${fileName}.html`,
        contentType: "text/html",
    });
};

export const test = base.extend<{
    api: ApiHelper;
    web: WebHelper;
    ssh: SshHelper;
    json: JsonReader;
    testConfig: IniConfigReader;
    webProperty: IniConfigReader;
    globalAfterEachHook: void;
}>({
    // Global after each test hook -- runs after each test
    globalAfterEachHook: [
        async ({ request, testConfig }, use, testInfo) => {
            await use();

            logInfo(
                `\n====Global After each Hook==== \nTest: ${testInfo.title}, Status: ${testInfo.status}, Duration :${testInfo.duration} ms, File : ${testInfo.file}`
            );
        },
    ],
    testConfig: async ({}, use) => {
        const configReader = new IniConfigReader("testConfig.ini");
        await use(configReader);
    },
    json: async ({ testConfig }, use) => {
        console.log("Initializing JSON reader with:", testConfig.jsonPath);
        await use(new JsonReader(testConfig.jsonpath));
        // npx playwright test --config:jsonPath=./alternative-config.json -- command to pass json filename
        //npx playwright test --config:jsonPath=./moataeldebsy.json --debug ./tests/e2e/moatazeldebsy/form.spec.ts
    },
    api: async ({ request }, use) => {
        await use(new ApiHelper(request));
    },

    web: async ({ page, browser, json, testConfig }, use) => {
        const context = await browser.newContext({ viewport: null });
        await use(new WebHelper(page, context, json, testConfig));
    },
    ssh: async ({ testConfig }, use) => {
        await use(new SshHelper(testConfig));
    },

    page: async ({ browser }, use, testInfo) => {
        // Initialize HAR recording
        const context = await initHarRecording(browser, testInfo);
        const page = await context.newPage();

        // Array to store failed API details for this test run
        const responseApis: any = [];
        const requestApis: any = [];
        const failedApis: any = [];

        // Add the response listener to the page
        page.on("response", async (response) => {
            const request = response.request();
            const url = request.url();

            if (["xhr", "fetch"].includes(request.resourceType())) {
                responseApis.push({
                    url,
                    method: request.method(),
                    status: response.status(),
                    statusText: response.statusText(),
                    body: response
                        .json()
                        .catch(() => "Unbale to parse response body"),
                });
            }
        });

        page.on("requestfailed", async (request) => {
            const url = request.url();
            failedApis.push({
                url,
                method: request.method(),
                failureText: request.failure()?.errorText || "Unknonw Error",
            });
        });

        page.on("request", async (request) => {
            const url = request.url();
            requestApis.push({
                url,
                method: request.method(),
                request: request.headers(),
                body: request.postData(),
            });
        });

        // Proceed with the actual test execution
        await use(page);

        // Log any failed APIs
        if (failedApis.length > 0) {
            console.log("\n--- Failed APIs Detected ---");
            console.log(failedApis);
            console.log("----------------------------\n");
        }

        // Teardown HAR recording
        await teardownHarRecording(page, testInfo, "on");
    },
});

export type { TestInfo } from "@playwright/test";
export { expect } from "@playwright/test";
