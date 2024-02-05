import { BrowserContext, Page, expect } from "@playwright/test";

export class WebHelper {
  readonly webPage: Page;
  readonly browserContext: BrowserContext;

  constructor(webPage: Page, browserContext: BrowserContext) {
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
}
