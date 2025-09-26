import { test, expect } from "../../fixtures/customFixtures"
import type { TestInfo } from "../../fixtures/customFixtures"
import { logInfo } from '../../../src/utils/report/Logger';

test("Perform operation on Input field using fill()", async ({ web }, testInfo: TestInfo) => {
    //Navigate to URL
    await web.navigateToUrl("https://test-edzotech.web.app/index.html");

    //Find locator
    const nameInputField = await web.webPage.locator("//input[@id='name']");

    //Check if enabled
    const isInputFieldEnabled = await nameInputField.isEnabled();
    logInfo("Is input field enabled?", isInputFieldEnabled); //returns true

    //Check if visible
    const isInputFieldVisible = await nameInputField.isVisible();
    logInfo("Is input field visible?", isInputFieldVisible); //returns true

    //Fill data 
    await nameInputField.fill("ABCD123");

    //Read value using textContent()
    const textOne = await nameInputField.textContent();

    //Read value using innerText()
    const textTwo = await nameInputField.innerText();

    //Read value using innerHTML()
    const textThree = await nameInputField.innerHTML();

    //Read value using inputValue()
    let textFour = await nameInputField.inputValue();

    //Log value using textContent()
    logInfo("Read value using textContent()", textOne); //returns blank

    //Log value using innerText()
    logInfo("Read value using innerText()", textTwo); //returns blank

    //Log value using innerHTML()
    logInfo("Read value using innerHTML()", textThree); //returns blank

    //Log value using inputValue()
    logInfo("Read value using inputValue()", textFour); //returns ABCD123

    // Assertion to verify the value was set correctly
    await expect(nameInputField).toHaveValue('ABCD123');

    //Clear input field
    await nameInputField.clear();

    //Read value using inputValue() after clear()
    textFour = await nameInputField.inputValue();

    //Log value using inputValue() after clear()
    logInfo("Read value using inputValue() after clear()", textFour); //returns ''        
});


test("Perform operation on Input field using pressSequentially()", async ({ web }, testInfo: TestInfo) => {
    //Navigate to URL
    await web.navigateToUrl("https://test-edzotech.web.app/index.html");

    //Find locator
    const nameInputField = await web.webPage.locator("//input[@id='name']");

    //Enter text on interval of 1 second
    await nameInputField.pressSequentially("ABCD123",{delay:1000});

    //Assertion to verify the value was set correctly
    expect(nameInputField).toHaveValue('ABCD123');
})


test.only('Perofrm operation on Input field using press',async({web},testInfo:TestInfo)=>{
    //Navigate to URL
    await web.navigateToUrl("https://test-edzotech.web.app/index.html");

    //Find locator
    const nameInputField = await web.webPage.locator("//input[@id='name']");

    //Press the Enter key
    await nameInputField.press("Enter");
})