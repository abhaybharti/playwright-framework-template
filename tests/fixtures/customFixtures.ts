import { test as base, BrowserContext, Browser, Page, TestInfo, VideoMode,expect } from '@playwright/test'
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { pwApi } from 'pw-api-plugin';
import { analyzeHAR } from '@src/utils/harAnalyser';
import { JsonReader } from '@src/utils/reader/jsonReader';

type MyMixtures = {
    context: BrowserContext
}

// Initialize browser context with HAR recording
const initHarRecording = async (browser: Browser, testInfo: TestInfo) => {
  const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')
  const harFilePath = `./test-results/${fileName}.har`
  const newContext = await browser.newContext({
    recordHar: {
      path: harFilePath,
      mode: 'full',
      urlFilter: /api.practicesoftwaretesting.com/,
    },
    ...(testInfo.project.metadata?.video ? {
      recordVideo: {
        dir: testInfo.outputPath('videos'),
      },
    } : {}),
  })
  return newContext
}

// Teardown and save HAR file
const teardownHarRecording = async (page: Page, testInfo: TestInfo, videoMode: 'on' | 'off') => {
  const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')
  if (videoMode === 'on') {
    const videoPath = testInfo.outputPath('my-video.webm')
    await Promise.all([page.video()?.saveAs(videoPath), page.close()])
    testInfo.attachments.push({
      name: 'video',
      path: videoPath,
      contentType: 'video/webm',
    })
  }
  await page.context().close({ reason: 'Saving HAR file' })
  await analyzeHAR(`./test-results/${fileName}.har`, `./test-results/${fileName}.html`)
  await testInfo.attach('Network Console', { path: `./test-results/${fileName}.html`, contentType: 'text/html' })
}

export const test = base.extend<{ 
  api: ApiHelper; 
  web: WebHelper; 
  ssh: SshHelper; 
  MyMixtures: any;
  json: JsonReader; 
  config: { jsonPath: string };
}>({
    config: async ({}, use) => {
        // Get JSON path from environment variable or use default
        const jsonPath = process.env.JSON_PATH || 'moataeldebsy.json';
        await use({ jsonPath });
    },
    api: async ({ page}, use) => {
        await use(new ApiHelper(page,pwApi))
    },

    web: async ({ page, browser,config }, use) => {
        console.log(config.jsonPath)
        const context = await browser.newContext();
        await use(new WebHelper(page, context,config.jsonPath));
    },
    ssh: async ({ }, use) => {
        await use(new SshHelper())
    },
    json:async({config},use)=>{
        console.log('Initializing JSON reader with:', config.jsonPath);
        await use(new JsonReader(config.jsonPath)) 

        // npx playwright test --config:jsonPath=./alternative-config.json -- command to pass json filename

        //npx playwright test --config:jsonPath=./moataeldebsy.json --debug ./tests/e2e/moatazeldebsy/form.spec.ts 
    },
    page: async ({ browser }, use, testInfo) => {
        // Initialize HAR recording
        const context = await initHarRecording(browser, testInfo);
        const page = await context.newPage();
        
        // Array to store failed API details for this test run
        const failedApis: any = [];
    
        // Add the response listener to the page
        page.on('response', (response) => {
          const request = response.request();
          // Filter for API calls (XHR or fetch requests) and non-200 status codes
          if (['xhr', 'fetch'].includes(request.resourceType()) && response.status() !== 200) {
            failedApis.push({
              url: request.url(),
              method: request.method(),
              status: response.status(),
            });
          }
        });
    
        // Proceed with the actual test execution
        await use(page);
        
        // Log any failed APIs
        if (failedApis.length > 0) {
          console.log('\n--- Failed APIs Detected ---');
          console.log(failedApis);
          console.log('----------------------------\n');
        } else {
          console.log('All API calls for this test succeeded.');
        }
        
        // Teardown HAR recording
        await teardownHarRecording(page, testInfo, 'on');
    },
    
})

export type {TestInfo} from "@playwright/test"
export {expect} from "@playwright/test"

