import { logInfo } from "@src/utils/report/Logger";
import { expect, test } from "@tests/fixtures/test-options";

const baseURL = 'https://test-edzotech.web.app/index.html';


test("Test 0 : Subscribe on dialog and call dismiss by clicking on Ok button", async ({
  web,page
}) => {

  page.on('dialog', dialog => {
    logInfo('Script Alert ' + dialog.message());
    dialog.accept();
  })

  await web.navigateToUrl(baseURL)

  const element = await web.findElement('xpath', "//*[@id='show-alert-btn']");

  expect(element).not.toBeNull();

  await element!.click();
});

test("Test 1 : Subscribe on dialog and call dismiss by clicking on Ok button", async ({
  web
}) => {

  await web.navigateToUrl(baseURL)

  const element = await web.findElement('xpath', "//*[@id='show-alert-btn']");

  expect(element).not.toBeNull();

  await Promise.all([
    web.waitAndHandleDialog('accept'), // or 'dismiss', with optional prompt text
    await element!.click(),                   // this triggers the dialog
  ]);
});

test("Test 2 : Subscribe on dialog and call accept  by clicking on Ok button", async ({
  web, page
}) => {

  page.on('dialog', dialog => {
    logInfo('Script Alert ' + dialog.message());
    dialog.accept();
  })

  await web.navigateToUrl(baseURL)

  const element = await web.findElement('xpath', "//*[@id='show-confirm-btn']");

  await element!.click();
  
});

test("Test 3 : Subscribe on dialog and dismiss by clicking on Cancel button", async ({
  web, page
}) => {

  page.on('dialog', dialog => {
    logInfo('Script Alert ' + dialog.message());
    dialog.dismiss();
  })

  await web.navigateToUrl(baseURL)

  const element = await web.findElement('xpath', "//*[@id='show-confirm-btn']");

  await element!.click();
  
});

test("Test 4 : Subscribe on Prompt, enter text in input box and call accept  by clicking on Ok button", async ({
  web, page
}) => {

  let textVal = "";
  page.on('dialog', dialog => {
    logInfo('Script Alert ' + dialog.message());
    dialog.accept(textVal);
  })

  await web.navigateToUrl(baseURL)

  const element = await web.findElement('xpath', "//*[@id='show-prompt-btn']");

  await element?.click();


  textVal = "Enter value in Prompt"
});
