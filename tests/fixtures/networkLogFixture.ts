//save this file as network.log.fixture
import { test as base, Browser, Page, TestInfo } from '@playwright/test'
import { analyzeHAR } from '../../src/utils/harAnalyser'

const init = async (browser: Browser, testInfo: TestInfo, video: any) => {
  const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')
  const harFilePath = `./test-results/${fileName}.har`
  const newContext = await browser.newContext({
    recordHar: {
      path: harFilePath,
      mode: 'full',
      urlFilter: /api.practicesoftwaretesting.com/, //capture network request that contain "api.practicesoftwaretesting.com" in url
    },
    ...(video === 'on'
      ? {
          recordVideo: {
            dir: testInfo.outputPath('videos'),
          },
        }
      : {}),
  })
  return newContext
}

//Runs at the end of each test that uses this fixture
const tearDown = async (newPage: Page, testInfo: TestInfo, video: any) => {
  const fileName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')
  if (video === 'on') {
    const videoPath = testInfo.outputPath('my-video.webm')
      await Promise.all([newPage.video()?.saveAs(videoPath), newPage.close()])
      testInfo.attachments.push({
        name: 'video',
        path: videoPath,
        contentType: 'video/webm',
      })
    
  }
  await newPage.context().close({ reason: 'Saving HAR file' })
  await analyzeHAR(`./test-results/${fileName}.har`, `./test-results/${fileName}.html`)
  await testInfo.attach('Network Console', { path: `./test-results/${fileName}.html`, contentType: 'text/html' })
}

//customised page fixture
export const test = base.extend({
  page: async ({ browser, video }, use, testInfo) => {
    const context = await init(browser, testInfo, video)
    const newPage = await context.newPage()
    await use(newPage)
    await tearDown(newPage, testInfo, video)
  },

})