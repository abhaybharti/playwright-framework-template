import test, { expect } from "@playwright/test";
import { WebHelper } from "../../../helper/web/webHelper";

test("Test 1 : Subscribe on dialog and call dismiss by clicking on Ok button", async ({
  page,
  browser,
}) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);

  const expectedText = "I am JS Alert";
  //setup listener to handle alert box
  webHelper.acceptAlertBox();

  //write code to open alert box
  await webHelper.clickByText("click to open alert box");

  //Assert
  expect(await webHelper.getAlertText()).toBe(expectedText);
});

test("Test 2 : Subscribe on dialog and call accept  by clicking on Ok button and dismiss by clicking on Cancel button", async ({
  page,
  browser,
}) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);

  const expectedText = "I am JS Confirm box";
  //setup listener to click on Ok button on confirm box
  webHelper.acceptConfirmBox();

  //write code to open alert box
  await webHelper.clickByText("click to open Confirm box");

  //Assert
  expect(await webHelper.getAlertText()).toBe(expectedText);

  //setup listener to click on Cancel button on confirm box
  webHelper.dismissConfirmBox();

  //write code to open alert box
  await webHelper.clickByText("click to open Confirm box");

  //Assert
  expect(await webHelper.getAlertText()).toBe(expectedText);
});

test("Test 3 : Subscribe on Prompt, enter text in input box and call accept  by clicking on Ok button", async ({
  page,
  browser,
}) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);

  const expectedText = "I am JS Prompt box";
  //setup listener to click on Ok button on confirm box
  webHelper.handlePromptBox(expectedText);

  //write code to open alert box
  await webHelper.clickByText("click to open Prompt box");

  //Assert
  expect(await webHelper.getAlertText()).toBe(expectedText);
});
