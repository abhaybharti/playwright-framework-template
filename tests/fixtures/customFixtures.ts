import { test as base, BrowserContext } from '@playwright/test'
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { pwApi } from 'pw-api-plugin';

import { } from "@playwright/test";
import { JsonReader } from '@src/utils/reader/jsonReader';
import { config } from 'dotenv';

type MyMixtures = {
    context: BrowserContext
}

export const test = base.extend<{ api: ApiHelper; web: WebHelper; ssh: SshHelper; MyMixtures: any;json:JsonReader; config: { jsonPath: string }  }>({

    api: async ({ page}, use) => {
        await use(new ApiHelper(page,pwApi))
    },

    web: async ({ page, browser,config }, use) => {
        const context = await browser.newContext();
        await use(new WebHelper(page, context,config.jsonPath));
    },
    ssh: async ({ }, use) => {
        await use(new SshHelper())
    },
    json:async({config},use)=>{
        console.log(config.jsonPath)
        await use(new JsonReader(config.jsonPath)) 

        // npx playwright test --config:jsonPath=./alternative-config.json -- command to pass json filename
    }
})

