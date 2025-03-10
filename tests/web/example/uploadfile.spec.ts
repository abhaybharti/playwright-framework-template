import test, { expect } from "@playwright/test";
import { WebHelper } from "../../../helper/web/webHelper";
import path from "path";

test("File Upload Test ", async ({ page, browser }) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);

  //Arrange
  const fileName = "uploadFile.txt";
  const filePath = path.resolve(__dirname, `../test-data/${fileName}`);

  //Action
  await webHelper.uploadFile(fileName, filePath, "locatorOfUploadLink");

  //Assert
  expect(await webHelper.elementHasText("locatorOfUploadLink", fileName));
});
