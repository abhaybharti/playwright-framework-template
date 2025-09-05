import { expect,test } from "@tests/fixtures/test-options";


test("Test 1 : Subscribe on dialog and call dismiss by clicking on Ok button", async ({
  page,
  browser,web,api
}) => {
    
  const expectedText = "I am JS Alert";
  
  await web.acceptAlertBox();

  await web.clickByText("click to open alert box");

  expect(await web.getAlertText()).toBe(expectedText);
});

test("Test 2 : Subscribe on dialog and call accept  by clicking on Ok button and dismiss by clicking on Cancel button", async ({
  browser,web
}) => {
  
  const expectedText = "I am JS Confirm box";
  
  web.acceptConfirmBox();

  await web.clickByText("click to open Confirm box");

  expect(await web.getAlertText()).toBe(expectedText);

  web.dismissConfirmBox();

  await web.clickByText("click to open Confirm box");

  expect(await web.getAlertText()).toBe(expectedText);
});

test("Test 3 : Subscribe on Prompt, enter text in input box and call accept  by clicking on Ok button", async ({
  
  web,api
}) => {
  
  

  const expectedText = "I am JS Prompt box";
  
  await web.handlePromptBox(expectedText);

  await web.clickByText("click to open Prompt box");

  expect(await web.getAlertText()).toBe(expectedText);
});
