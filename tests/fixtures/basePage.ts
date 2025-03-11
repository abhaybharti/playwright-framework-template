import { test as base, Page, BrowserContext, expect, APIResponse, APIRequestContext, Locator } from '@playwright/test'
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { } from "@playwright/test";

export const test = base.extend<{ api: ApiHelper; web: WebHelper; ssh: SshHelper; page: Page; browserContext: BrowserContext; apiRequest: APIRequestContext }>({

    api: async ({ apiRequest }, use) => {
        await use(new ApiHelper(apiRequest))
    },

    web: async ({ page,browserContext }, use) => {
        await use(new WebHelper(page,browserContext));
    },
    ssh:async({},use)=>{
        await use(new SshHelper())
    }
})

