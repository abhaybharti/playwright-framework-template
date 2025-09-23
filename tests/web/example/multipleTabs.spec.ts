import { chromium,test } from "@playwright/test"

test('Multiple Tabs',async()=>{
    //Launch Browser
    const browser = await chromium.launch({headless:false,args:["--start-maximized"]})

    //Create New browser Context
    const context = await browser.newContext();


    //Open the first tab (page)
    const tabOne = await context.newPage()
    await tabOne.goto('https://www.google.com')
    await tabOne.waitForTimeout(2000)
    console.log(await tabOne.url())


    //Open the second tab (page) in same context
    const tabTwo = await context.newPage()
    await tabTwo.goto('https://timesofindia.indiatimes.com/')
    await tabTwo.waitForTimeout(2000)
    console.log(await tabTwo.url())
    
    //Perform action on first tab, focus on first tab
    await tabOne.bringToFront();

    //Perform action on second tab, focus on second tab
    await tabTwo.bringToFront();

    //Close the browser
    await browser.close()
})


