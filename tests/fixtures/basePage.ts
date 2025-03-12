import { test as base, Page, BrowserContext } from '@playwright/test'
import { ApiHelper, SshHelper, WebHelper } from "../../src/helper";
import { } from "@playwright/test";

type MyMixtures = {
    context: BrowserContext
}

export const test = base.extend<{ api: ApiHelper; web: WebHelper; ssh: SshHelper; MyMixtures: any; }>({

    api: async ({ request }, use) => {
        await use(new ApiHelper(request))
    },

    web: async ({ page, browser }, use) => {
        const context = await browser.newContext();
        await use(new WebHelper(page, context));
    },
    ssh: async ({ }, use) => {
        await use(new SshHelper())
    }
})

