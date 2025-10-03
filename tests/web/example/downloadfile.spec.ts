import { test, expect } from "../../fixtures/customFixtures"
import fs from "fs";
import path from "path";

test("File Download Test ", async ({web,  browser }) => {
  const context = await browser.newContext();
  

  //Arrange
  const expectedFileName = "fileToDownload.txt";
  const downloadFolderPath = path.resolve(__dirname, "../test-data"); // path to the folder where the downloaded file will be saved
  const savePath = path.join(downloadFolderPath, expectedFileName);

  //Action
  await web.downLoadFile(
    expectedFileName,
    downloadFolderPath,
    "locatorOfDownloadLink"
  );

  //Assert
  expect(fs.existsSync(savePath)).toBeTruthy();

  //Clean up : remove downloaded file
  fs.unlinkSync(savePath);
});
