import { BrowserContext, Page, expect, Locator } from "@playwright/test";

import fs from "fs";
import { Helper } from "@src/helper/Helper";
import { JsonReader } from "@src/utils/reader/jsonReader";
import { step } from "@src/utils/report/ReportAction";


interface ChangedValueParams {
  elementName: string;
  valueToUse?: string;  // Optional parameter for values  
}

export class WebHelper extends Helper {
  readonly webPage: Page;
  readonly browserContext: BrowserContext;
  readonly json: JsonReader;


  constructor(webPage: Page, browserContext: BrowserContext, jsonPath: string) {
    super();
    this.webPage = webPage;
    this.browserContext = browserContext;
    this.json = new JsonReader(jsonPath);
  }


  @step("changeValueOnUi")
  async changeValueOnUi(
    params: ChangedValueParams
  ): Promise<any> {

    let { elementName, valueToUse } = params;

    const objType: string = await this.json.getJsonValue(elementName, "objType")
    const locatorType: string = await this.json.getJsonValue(elementName, "locatorType")
    const locatorValue: string = await this.json.getJsonValue(elementName, "locatorValue")

    const elementInfo = await this.findElement(locatorType, locatorValue);

    if (null === elementInfo) {
      console.log(`Element ${locatorType} ${locatorValue} is not found`)
      return null;
    }

    let testData: string[] = [];
    if (typeof valueToUse === 'undefined') {
      testData = this.json.getJsonValue(elementName, "saveTestData").split("|");
    }


    try {
      let result: string;


      switch (objType.toLowerCase()) {
        case 'toggle':
          break;
        case 'checkbox':
          let currentStatus = await this.getCheckBoxStatus(elementInfo) ? "true" : "false";
          if (currentStatus !== valueToUse) {
            await this.setCheckBoxStatus(elementInfo, valueToUse);
          }

          break;
        case 'textbox':
        case 'textarea':
          let currentValue = await this.getText(elementInfo)
          if (testData.length !== 0) {
            valueToUse = this.getValueFromArray(testData, currentValue);
          }

          if (currentValue !== valueToUse) {
            await this.enterText(elementInfo, valueToUse || '');
          }
          let afterChangeValue = await this.getText(elementInfo);
          break;
        case 'dropdown':
          break;
        case 'radiobutton':
          break;

        default:
          throw new Error(`Unsupported Object type: ${objType}`);
      }
    } catch (error) {
      throw new Error(`Unsupported operation type: ${objType}`);
    }
  }




  /**
  * Finds a single element using the specified locator strategy
  * Checks if element is displayed and enabled
  * Returns null if element is not found
  * @param { string } type - Locator type('css', 'xpath', 'text', 'testid', 'role', 'label')
  * @param { string } value - Locator value
  * @returns { Promise<{ locator: import('@playwright/test').Locator, isDisplayed: boolean, isEnabled: boolean } | null> } Playwright locator with status or null
  */
  @step('findElement')
  async findElement(type: string, value: string): Promise<Locator | null> {
    try {
      let locator: Locator;
      switch (type.toLowerCase()) {
        case 'css':
          locator = this.webPage.locator(value);
          break;
        case 'xpath':
          locator = this.webPage.locator(`xpath=${value}`);
          break;
        case 'text':
          locator = this.webPage.getByText(value);
          break;
        case 'testid':
          locator = this.webPage.getByTestId(value);
          break;
        case 'role':
        // locator = this.webPage.getByRole(value as Role,{name:value,exact:false});
        // break;
        case 'label':
          locator = this.webPage.getByLabel(value);
          break;
        case 'placeholder':
          locator = this.webPage.getByPlaceholder(value);
          break;
        default:
          console.warn(`Unsupported locator type: ${type}`);
          return null;
      }

      // Check if element exists
      const count = await locator.count();
      if (count === 0) {
        console.warn(`Element not found with ${type} locator: ${value}`);
        return null;
      }

      // Check visibility and enabled status
      const isDisplayed = await locator.isVisible();
      const isEnabled = await locator.isEnabled();

      if (!locator) {
        console.log(`Element ${type} ${value} is not found`);
        return null;
      }

      if (!isDisplayed || !isEnabled) {
        console.log(`Element ${type} ${value} is not visible or enabled`);
        return null;
      }
      return locator;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Error while finding element with ${type} locator: ${value}. Error: ${errorMessage}`);
      return null;
    }
  }

  /**
   * The `delay` function is an asynchronous function that waits for a specified amount of time before
   * resolving.
   * @param {number} time - The `time` parameter is a number that represents the duration of the delay
   * in seconds.
   * @returns a Promise that resolves to void.
   */
  @step('delay')
  async delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, time * 1000);
    });
  }

  /**
   * The function clicks on an element on a web page based on its text content.
   * @param {string} text - The text parameter is a string that represents the text content of an element
   * that you want to click on. It is used to locate the element on the web page.
   * @param {boolean} [exact=true] - The `exact` parameter is a boolean value that determines whether the
   * text should be matched exactly or not. If `exact` is set to `true`, the `clickByText` function will
   * only click on elements that have an exact match with the provided text. If `exact` is set to `
   */
  @step('click By Text')
  async clickByText(text: string, exact: boolean = true): Promise<void> {
    await this.webPage.getByText(text, { exact: exact }).click();
  }

  @step('rightClickButton')
  async rightClickButton(locator: string): Promise<void> {
    await this.webPage.locator(locator).click({ button: "right" });
  }

  @step('leftClickButton')
  async leftClickButton(locator: string): Promise<void> {
    await this.webPage.locator(locator).click({ button: "left" });
  }

  @step('navigateToUrl : {url}')
  async navigateToUrl(url: string): Promise<void> {
    await this.webPage.goto(url);
  }

  @step('verifyDragAndDrop')
  async verifyDragAndDrop(
    source: string,
    target: string,
    verifyText: string
  ): Promise<void> {
    let draggable = await this.webPage.locator(source);
    let droppable = await this.webPage.locator(target);
    await draggable.hover();
    await this.webPage.mouse.down();
    await droppable.hover();
    await this.webPage.mouse.up();
    await expect(droppable).toContainText(verifyText);
  }

  @step('verifyToolTip')
  async verifyToolTip(locator: string, hoverText: string): Promise<void> {
    let el = await this.webPage.locator(locator);
    el.hover();
    await expect(el).toContainText(hoverText);
  }

  @step('verifyFileDownload')
  async verifyFileDownload(): Promise<void> {
    //TBD
  }

  @step('verifyNewTab')
  async verifyNewTab(newTabUrlExpected: string): Promise<void> {
    //TBD
  }

  @step('verifyNewWindow')
  async verifyNewWindow(newWindowUrlExpected: string): Promise<void> {
    //TBD
  }

  @step('verifyFrameText')
  async verifyFrameText(): Promise<void> {
    //TBD
  }
  @step('verifyNestedFrame')
  async verifyNestedFrame(): Promise<void> {
    //TBD
  }

  /**
   * The function asserts that the current page URL matches the expected URL.
   * @param {string} url - The `url` parameter is a string that represents the expected URL of a web
   * page.
   */
  @step('assertPageURL')
  async assertPageURL(url: string): Promise<void> {
    console.log(`Asserts that page url is ${url}.`);
    await expect(this.webPage).toHaveURL(url);
  }

  /**
   * The function asserts that the page title matches the expected title.
   * @param {string} title - The title parameter is a string that represents the expected title of the
   * web page.
   */
  @step('assertPageTitle')
  async assertPageTitle(title: string): Promise<void> {
    console.log(`Asserts that page title is ${title}.`);
    await expect(this.webPage).toHaveTitle(title);
  }
  /**
   * The function opens a new tab in a browser context, navigates to a specified URL, and returns the
   * page object representing the new tab.
   * @param {string} url - A string representing the URL of the webpage that you want to open in a new
   * tab.
   * @returns a Promise that resolves to a Page object.
   */
  @step('openNewTab')
  async openNewTab(url: string): Promise<Page> {
    const pageOne = await this.browserContext.newPage();
    await pageOne.goto(url);
    return pageOne;
  }

  /**
   * The function takes a screenshot of a web page and saves it as an image file.
   * @param {string} imageName - The imageName parameter is a string that specifies the name of the
   * screenshot image file. If no value is provided, it defaults to "screenshot.png".
   */
  @step('takeFullPageScreenshot')
  async takeFullPageScreenshot(
    imageName: string = `screenshot.png`
  ): Promise<void> {
    await this.webPage.screenshot({ path: `${imageName}`, fullPage: true });
  }

  @step('takePageScreenshot')
  async takePageScreenshot(
    imageName: string = `screenshot.png`
  ): Promise<void> {
    await this.webPage.screenshot({ path: `${imageName}` });
  }

  /**
   * The function takes a locator and an optional image name as parameters, finds the element on a web
   * page using the locator, and takes a screenshot of the element.
   * @param {string} locator - The `locator` parameter is a string that represents the element you want
   * to take a screenshot of. It can be a CSS selector, an XPath expression, or any other valid locator
   * strategy supported by the `this.webPage.locator` method.
   * @param {string} imageName - The `imageName` parameter is a string that specifies the name of the
   * screenshot image file. If no value is provided, it defaults to "screenshot.png".
   */
  @step('takeScreenshotOfElement')
  async takeScreenshotOfElement(
    locator: string,
    imageName: string = `screenshot.png`
  ): Promise<void> {
    const el = await this.webPage.locator(locator);
    await el.screenshot({ path: `${imageName}` });
  }

  @step('clipScreenshot')
  async clipScreenshot(imageName: string = `screenshot.png`): Promise<void> {
    await this.webPage.screenshot({
      path: `${imageName}`,
      clip: { x: 0, y: 0, width: 800, height: 800 },
    });
  }

  /**
   * The function checks if an element on a web page contains the expected text.
   * @param {string} target - A string representing the target element to locate on the web page.
   * @param {string} expectedText - The expected text that you want the element to contain.
   */
  @step('elementContainText')
  async elementContainText(
    target: string,
    expectedText: string
  ): Promise<void> {
    console.log(
      `Asserts that element ${target} contains text ${expectedText}.`
    );
    const el = await this.webPage.locator(target);
    await expect(el).toContainText(expectedText);
  }

  /**
   * The function checks if an element on a web page has the expected text.
   * @param {string} target - The target parameter is a string that represents the locator for the
   * element you want to check for text. It could be a CSS selector, an XPath expression, or any other
   * valid locator strategy supported by the testing framework you are using.
   * @param {string} expectedText - The expected text that the element should have.
   */
  @step('elementHasText')
  async elementHasText(target: string, expectedText: string): Promise<void> {
    console.log(
      `Asserts that element ${target} has expected text ${expectedText}.`
    );
    const el = await this.webPage.locator(target);
    await expect(el).toHaveText(expectedText);
  }

  /**
   * The function asserts that a specified element is visible on a web page.
   * @param {string} target - The `target` parameter is a string that represents the locator of the
   * element you want to check for visibility. It could be a CSS selector, an XPath expression, or any
   * other valid locator that can be used to identify the element on the web page.
   */
  @step('elementIsVisible')
  async elementIsVisible(target: string): Promise<void> {
    console.log(`Asserts that element ${target} is visible.`);
    expect(await this.webPage.locator(target)).toBeVisible();
  }

  /**
   * The function asserts that a specified element is not visible on a web page.
   * @param {string} target - The target parameter is a string that represents the locator or selector
   * for the element that you want to check for visibility. It can be a CSS selector, an XPath
   * expression, or any other valid locator that can be used to identify the element on the web page.
   */
  @step('elementIsNotVisible')
  async elementIsNotVisible(target: string): Promise<void> {
    console.log(`Asserts that element ${target} is not visible.`);
    expect(await this.webPage.locator(target)).toBeHidden();
  }

  @step('elementHasAttributeAndValue')
  async elementHasAttributeAndValue(
    target: string,
    attribute: string,
    attributeVal: string
  ): Promise<void> {
    console.log(
      `Asserts that '${target}' has a specific attribute '${attribute}' with the expected value '${attributeVal}'.`
    );
    //expect(await (target).toHaveAttribute(attribute, attributeVal));
  }

  /**
   * The `blockRequest` function blocks all requests in a given browser context that do not start with a
   * specified request name.
   * @param {BrowserContext} context - The `context` parameter is an instance of a `BrowserContext`
   * object. It represents a browser context in Puppeteer, which is a container for a set of pages and
   * allows for fine-grained control over browser behavior.
   * @param {string} requestName - The `requestName` parameter is a string that represents the name of
   * the request you want to block.
   * Call this method in your tests
   */
  @step('blockRequest')
  async blockRequest(context: BrowserContext, requestName: string) {
    await context.route("**/*", (request) => {
      request.request().url().startsWith(`${requestName}`)
        ? request.abort()
        : request.continue();
      return;
    });
  }

  /**
   * The function will setup a listener for alert box, if dialog appears during the test then automatically accepting them.
   * Alert box contains only Ok button
   */
  @step('acceptAlertBox')
  async acceptAlertBox(): Promise<void> {
    console.log(`Handle Alert Box by clicking on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.dismiss());
  }

  /**
   * The function will setup a listener for Confirm box, if dialog appears during the test then automatically call accept/dismiss method.
   * Confirm box contains Ok/Cancel button
   */
  @step('acceptConfirmBox')
  async acceptConfirmBox(): Promise<void> {
    console.log(`Accept Confirm Box by clicking on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.accept());
  }

  @step('dismissConfirmBox')
  async dismissConfirmBox(): Promise<void> {
    console.log(`Dismiss Confirm Box by clicking on Cancel button`);
    this.webPage.on("dialog", async (dialog) => dialog.dismiss());
  }

  /**
   * The function will setup a listener for Prompt box, if dialog appears during the test then automatically call accept/dismiss method.
   * Prompt box contains text box where user can enter text and submit (using Ok/Cancel button) it.
   */
  @step('handlePromptBox')
  async handlePromptBox(txtVal: string): Promise<void> {
    console.log(`Enter text message in Prompt Box and click on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.accept(txtVal));
  }

  @step('waitForDialogMessage')
  waitForDialogMessage(page: Page) {
    return new Promise((resolve) => {
      page.on("dialog", (dialog) => {
        resolve(dialog.message());
      });
    });
  }

  /**
   * The function will read text message from Alert and return.
   */
  @step('getAlertText')
  async getAlertText(): Promise<string> {
    console.log(`Read text message from Alert box`);
    let dialogMessage: string;
    dialogMessage = await this.waitForDialogMessage(
      this.webPage
    ).then.toString();
    console.log(dialogMessage);
    return dialogMessage;
  }

  /**
   * The function `getFrame` takes a frame locator as input and calls a method on the `webPage` object
   * to locate the frame.
   * @param {string} frameLocator - The frameLocator parameter is a string that represents the locator
   * or identifier of the frame you want to retrieve.
   */
  @step('getFrame')
  async getFrame(frameLocator: string) {
    return this.webPage.frameLocator(frameLocator);
  }

  /**
   * The function `getStringFromShadowDom` retrieves the text content from a specified element within
   * the Shadow DOM.
   * @param {string} locator - The `locator` parameter is a string that represents a CSS selector used
   * to locate an element within the Shadow DOM.
   * @returns a Promise that resolves to a string.
   */
  @step('getStringFromShadowDom')
  async getStringFromShadowDom(locator: string): Promise<string> {
    return (await this.webPage.locator(locator).textContent()) as string;
  }

  /**
   * The `downLoadFile` function downloads a file by clicking on a specified locator and waits for the
   * download event to occur.
   * @param {string} locator - The locator parameter is a string that represents the selector used to
   * locate the element on the web page that triggers the file download. It could be an ID, class name,
   * CSS selector, or any other valid selector that can be used with the `this.webPage.locator()`
   * method to locate the element
   * @param {string} expectedFileName - The expectedFileName parameter is a string that represents the
   * name of the file that is expected to be downloaded.
   * @param {string} savePath - The `savePath` parameter is a string that represents the path where the
   * downloaded file will be saved on the local machine.
   */
  @step('downLoadFile')
  async downLoadFile(
    locator: string,
    expectedFileName: string,
    savePath: string
  ) {
    //start download
    const [download] = await Promise.all([
      this.webPage.waitForEvent("download"),
      this.webPage.locator(locator).click(),
    ]);
    const suggestedFileName = download.suggestedFilename()
    const filePath = 'download/' + suggestedFileName
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
    return filePath;
  }

  /**
   * The function uploads a file to a web page using the specified file path, file upload locator, and
   * upload button locator.
   * @param {string} filePath - The file path is the path to the file that you want to upload. It
   * should be a string that specifies the location of the file on your computer.
   * @param {string} fileUploadLocator - The fileUploadLocator parameter is a string that represents
   * the locator of the file upload input element on the web page. This locator is used to identify the
   * element where the file will be uploaded to.
   * @param {string} uploadBtnLocator - The `uploadBtnLocator` parameter is a string that represents
   * the locator of the upload button on the web page. It is used to locate and interact with the
   * upload button element on the page.
   */
  @step('uploadFile')
  async uploadFile(
    filePath: string,
    fileUploadLocator: string,
    uploadBtnLocator: string
  ) {
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist`);
      throw new Error(`File not found :${filePath}`);
    }

    await this.webPage.setInputFiles(`${fileUploadLocator}`, filePath);
    await this.webPage.locator(`${uploadBtnLocator}`).click();
  }

  /**
   * The function intercepts a specific route in a browser context, logs the request and response, and
   * continues with the intercepted request.
   * @param {string} interceptRoute - The interceptRoute parameter is a string that represents the route
   * that you want to intercept. It is used to match against the URL of incoming requests and determine
   * if the route should be intercepted.
   */
  @step('interceptRouteAndContinue')
  async interceptRouteAndContinue(interceptRoute: string) {
    await this.browserContext.route(interceptRoute, async (route) => {
      //Arrange & Log the request
      const response = await route.fetch();
      const json = await response.json();
      console.log(JSON.stringify(json, null, 10));

      //continue with the intercepted request
      await route.continue();
    });
  }

  /**
   * The function intercepts a specific route and aborts it.
   * @param {string} interceptRoute - The `interceptRoute` parameter is a string that represents the
   * URL pattern that you want to intercept and abort. It is used to match against the URLs of incoming
   * network requests.
   */

  @step('interceptRouteAndAbort')
  async interceptRouteAndAbort(interceptRoute: string) {
    await this.browserContext.route(interceptRoute, async (route) => {
      route.abort(); //abort the route
    });
  }
  /**
   * The function intercepts a specified route and modifies the response data with the provided JSON
   * data.
   * @param {string} interceptRoute - The `interceptRoute` parameter is a string that represents the
   * route that you want to intercept. It is the URL or path that you want to intercept and modify the
   * response for. For example, if you want to intercept the route "/api/data", you would pass
   * "/api/data" as the
   * @param {string} modifiedJsonData - The `modifiedJsonData` parameter is a string representing the
   * modified JSON data that you want to use as the response body for the intercepted route.
   */
  @step('interceptRouteAndChangeData')
  async interceptRouteAndChangeData(
    interceptRoute: string,
    modifiedJsonData: string
  ) {
    await this.browserContext.route(interceptRoute, async (route) => {
      const modifiedResponse = [`${modifiedJsonData}`];
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(modifiedResponse),
      });
    });
  }

  @step('changeElementValue')
  async changeElementValue(): Promise<void> { }

  @step('verifyValueFromUi')
  async verifyValueFromUi(): Promise<void> { }

  @step('getAttribute')
  async getAttribute(locator: string, attributeName: string): Promise<string> {
    const value = await this.webPage
      .locator(locator)
      .getAttribute(attributeName);
    return value ?? "";
  }

  @step('getText')
  async getText(el: Locator): Promise<string> {
    // Check if it's an input element
    const isInput = await el.evaluate(el =>
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT'
    );

    if (isInput) {
      // For input elements, get the value
      const value = await el.inputValue();
      return value ?? "";
    } else {
      // For other elements, get the text content
      const value = await el.textContent();
      return value ?? "";
    }
  }

  @step('press')
  async press(key: string): Promise<void> {
    await this.webPage.keyboard.press(key);
  }

  // async addStep(stepDescription: string, stepFunction: any): Promise<any> {
  //   return await test.step(stepDescription, stepFunction);
  // }

  // async attachScreenshot(
  //   locator: string,
  //   fileName: string,
  //   testInfo: TestInfo
  // ): Promise<void> {
  //   const file = testInfo.outputPath(fileName);
  //   const pathFile = path.dirname(file);
  //   const pathAttachments = path.join(pathFile, "attachments");
  //   const attachmentFile = path.join(pathAttachments, fileName);
  //   const screenshot = await webPage
  //     .locator(locator)
  //     .isVisible()
  //     .screenshot({ path: file });
  //   await fs.promise.writeFile(file, screenshot);
  //   if (!fs.existsSync(pathAttachments)) {
  //     fs.mkdirSync(pathAttachments, { recursive: true });
  //   }
  //   await fs.promises.writeFile(attachmentFile, screenshot);
  //   await testInfo.attach(fileName, { contentType: "image/png", path: file });
  // }

  @step('enterText')
  async enterText(el: Locator, value: string) {
    // await el.clear();
    await el.fill(value);
  }

  @step('setCheckBoxStatus')
  async setCheckBoxStatus(el: Locator, state: string = 'true') {
    let isChecked = await el.isChecked();
    let tryCount = 0;
    while (`${isChecked}` !== state) {
      if (`${isChecked}` !== `${state}` && `${state}` === `true`) {
        await el.check(); // Check the checkbox
        console.log('checkbox was not checked, now checked.');
      }

      if (`${isChecked}` !== `${state}` && `${state}` === `false`) {
        await el.check(); // unCheck the checkbox
        console.log('checkbox was checked, now unchecked.');
      }
      isChecked = await el.isChecked();
      tryCount++;

      if (tryCount == 3) {
        return false; //exit the loop        
      }
    }
  }

  @step('getCheckBoxStatus')
  async getCheckBoxStatus(el: Locator): Promise<boolean> {
    return await el.isChecked();
  }

  @step('getValueFromArray')
  getValueFromArray(testData: string[], preVal: string) {
    const currentIndex = testData.indexOf(preVal);
    const nextIndex = (currentIndex + 1) % testData.length;
    return testData[nextIndex];
  }
}
