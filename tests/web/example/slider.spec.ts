import { test } from "@tests/fixtures/customFixtures";
import {expect} from "@playwright/test";


test('Test Slider function', async ({web}) => {

    await web.navigateToUrl('https://the-internet.herokuapp.com/horizontal_slider')

    const slider = await web.findElement('xpath', "//input[@type='range']");

    await slider?.evaluate(node=>{(node as HTMLInputElement).value = '3'
        node.dispatchEvent(new Event('change'))
    })

    const result = await web.findElement('xpath', "//span[@id='range']")

    const resultText = await web.getText(result)

    await expect(resultText).toBe('3')
})