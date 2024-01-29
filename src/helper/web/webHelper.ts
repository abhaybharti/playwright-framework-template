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

  async assertPageURL(url: string): Promise<void> {
    console.log("Assertion for Page URL");
    await expect(this.webPage).toHaveURL(url);
  }

  async assertPageTitle(title: string): Promise<void> {
    console.log("Assertion for Page Title");
    await expect(this.webPage).toHaveTitle(title);
  }
  async openNewTab(url: string): Promise<Page> {
    const pageOne = await this.browserContext.newPage();
    await pageOne.goto(url);
    return pageOne;
  }
  async takeScreenshot(imageName: string = `screenshot.png`): Promise<void> {
    await this.webPage.screenshot({ path: `${imageName}`, fullPage: true });
  }

  async takeScreenshotOfElement(
    locator: string,
    imageName: string = `screenshot.png`
  ): Promise<void> {
    const el = await this.webPage.locator(locator);
    await el.screenshot({ path: `${imageName}` });
  }
}
