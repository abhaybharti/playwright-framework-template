import {test} from "@tests/fixtures/customFixtures"

test("Enter value in forms @form", async ({ page,web,api }) => {
    await page.goto("https://moatazeldebsy.github.io/test-automation-practices/#/forms");
    
    await web.changeValueOnUi({elementName:"Basic.Forms.UsernameText"})   

    
});


