import { logInfo } from "@src/utils/report/Logger";
import { test } from "@tests/fixtures/test-options";

test.describe('Local testing', () => {

    test.use({ locale: 'ru-RU', timezoneId: 'Asia/Tokyo', baseURL:'https://www.google.com' })

    test('Launch the Google website in Russian local', async ({ page }) => {
        await page.goto('/')
        const dateRes =  await page.evaluate(() => {
            return { 
               date: Date(),
               localization: navigator.language,
               timezoneId : Intl.DateTimeFormat().resolvedOptions().timeZone
           }
          });
          logInfo('dateRes : ',dateRes)

          await page.goto('https://www.typescriptlang.org/')

          await page.goto('/')


          await page.goto('https://yahoo.com')
          
    })
})
