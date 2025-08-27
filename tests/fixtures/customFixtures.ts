import { test as base, BrowserContext } from '@playwright/test'
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { pwApi } from 'pw-api-plugin';

import { } from "@playwright/test";
import { JsonReader } from '@src/utils/reader/jsonReader';

type MyMixtures = {
    context: BrowserContext
}

export const test = base.extend<{ api: ApiHelper; web: WebHelper; ssh: SshHelper; MyMixtures: any;json:JsonReader; config: { jsonPath: string }  }>({
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
    page: async ({ page }, use) => {
        // Array to store failed API details for this test run
        const failedApis:any = [];
    
        // Add the response listener to the page
        // This logic will run before each test starts
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
    
        // Proceed with the actual test execution.
        // The 'page' object with the listener attached is passed to your test.
        await use(page);
    
        // This logic runs after the test has finished.
        // We check for any failed APIs that were captured.
        if (failedApis.length > 0) {
          console.log('\n--- Failed APIs Detected ---');
          console.log(failedApis);
          console.log('----------------------------\n');
          // You could also add reporting or assertion logic here
          // For example: expect(failedApis).toEqual([]);
        } else {
          console.log('All API calls for this test succeeded.');
        }
      },
})

