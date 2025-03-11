import { test } from "../../fixtures/basePage";

test.describe('Demo website',()=>{

    test('Verify homepage', async({web})=>{
        await web.navigateToUrl("https://google.co.in");
    })
})