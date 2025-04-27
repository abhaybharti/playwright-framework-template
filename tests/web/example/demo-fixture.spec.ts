import { test } from "../../fixtures/customFixtures";

test.describe('Demo website',()=>{

    test('Verify homepage', async({web})=>{
        await web.navigateToUrl("https://google.co.in");
    })
})