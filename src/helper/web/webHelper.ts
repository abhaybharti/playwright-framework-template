import { BrowserContext, Page, expect } from "@playwright/test";
import fs from "fs";
import { Helper } from "helper/Helper";

export class WebHelper extends Helper {
  readonly webPage: Page;
  readonly browserContext: BrowserContext;

  constructor(webPage: Page, browserContext: BrowserContext) {
    super();
    this.webPage = webPage;
    this.browserContext = browserContext;
  }

  /**
   * The `delay` function is an asynchronous function that waits for a specified amount of time before
   * resolving.
   * @param {number} time - The `time` parameter is a number that represents the duration of the delay
   * in seconds.
   * @returns a Promise that resolves to void.
   */
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
  async clickByText(text: string, exact: boolean = true): Promise<void> {
    await this.webPage.getByText(text, { exact: exact }).click();
  }

  async rightClickButton(locator: string): Promise<void> {
    await this.webPage.locator(locator).click({ button: "right" });
  }

  async leftClickButton(locator: string): Promise<void> {
    await this.webPage.locator(locator).click({ button: "left" });
  }

  async navigateToUrl(url: string): Promise<void> {
    await this.webPage.goto(url);
  }

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

  async verifyToolTip(locator: string, hoverText: string): Promise<void> {
    let el = await this.webPage.locator(locator);
    el.hover();
    await expect(el).toContainText(hoverText);
  }

  async verifyFileDownload(): Promise<void> {
    //TBD
  }

  async verifyNewTab(newTabUrlExpected: string): Promise<void> {
    //TBD
  }

  async verifyNewWindow(newWindowUrlExpected: string): Promise<void> {
    //TBD
  }
  async verifyFrameText(): Promise<void> {
    //TBD
  }
  async verifyNestedFrame(): Promise<void> {
    //TBD
  }

  /**
   * The function asserts that the current page URL matches the expected URL.
   * @param {string} url - The `url` parameter is a string that represents the expected URL of a web
   * page.
   */
  async assertPageURL(url: string): Promise<void> {
    console.log(`Asserts that page url is ${url}.`);
    await expect(this.webPage).toHaveURL(url);
  }

  /**
   * The function asserts that the page title matches the expected title.
   * @param {string} title - The title parameter is a string that represents the expected title of the
   * web page.
   */
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
  async takeScreenshot(imageName: string = `screenshot.png`): Promise<void> {
    await this.webPage.screenshot({ path: `${imageName}`, fullPage: true });
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
  async takeScreenshotOfElement(
    locator: string,
    imageName: string = `screenshot.png`
  ): Promise<void> {
    const el = await this.webPage.locator(locator);
    await el.screenshot({ path: `${imageName}` });
  }

  /**
   * The function checks if an element on a web page contains the expected text.
   * @param {string} target - A string representing the target element to locate on the web page.
   * @param {string} expectedText - The expected text that you want the element to contain.
   */
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
  async elementIsNotVisible(target: string): Promise<void> {
    console.log(`Asserts that element ${target} is not visible.`);
    expect(await this.webPage.locator(target)).toBeHidden();
  }

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
  async acceptAlertBox(): Promise<void> {
    console.log(`Handle Alert Box by clicking on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.dismiss());
  }

  /**
   * The function will setup a listener for Confirm box, if dialog appears during the test then automatically call accept/dismiss method.
   * Confirm box contains Ok/Cancel button
   */
  async acceptConfirmBox(): Promise<void> {
    console.log(`Accept Confirm Box by clicking on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.accept());
  }

  async dismissConfirmBox(): Promise<void> {
    console.log(`Dismiss Confirm Box by clicking on Cancel button`);
    this.webPage.on("dialog", async (dialog) => dialog.dismiss());
  }

  /**
   * The function will setup a listener for Prompt box, if dialog appears during the test then automatically call accept/dismiss method.
   * Prompt box contains text box where user can enter text and submit (using Ok/Cancel button) it.
   */
  async handlePromptBox(txtVal: string): Promise<void> {
    console.log(`Enter text message in Prompt Box and click on Ok button`);
    this.webPage.on("dialog", async (dialog) => dialog.accept(txtVal));
  }

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

    await download.saveAs(savePath);
    return download;
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
}
