import { test, expect } from "@playwright/test";
import { WebHelper } from "../../../helper/web/webHelper";
import fs from "fs";
import path from "path";

test("File Download Test ", async ({ page, browser }) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);

  //Arrange
  const expectedFileName = "fileToDownload.txt";
  const downloadFolderPath = path.resolve(__dirname, "../test-data"); // path to the folder where the downloaded file will be saved
  const savePath = path.join(downloadFolderPath, expectedFileName);

  //Action
  await webHelper.downLoadFile(
    expectedFileName,
    downloadFolderPath,
    "locatorOfDownloadLink"
  );

  //Assert
  expect(fs.existsSync(savePath)).toBeTruthy();

  //Clean up : remove downloaded file
  fs.unlinkSync(savePath);
});
