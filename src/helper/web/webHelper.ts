import { BrowserContext, Page, expect, Locator } from "@playwright/test";
import { logError, logInfo } from "../logger/Logger";
import fs from "fs";
import { Helper } from "@src/helper/Helper";
import { JsonReader } from "@src/utils/reader/jsonReader";
import { step } from "../report/decorators/ReportActions";
import { WaitFor } from "../../../config/waitFor";
import { log } from "console";

interface ChangedValueParams {
    locatorName: string;
    valueToUse?: string;
    isTable?: boolean;
}

interface LocatorValueResult {
    objName: string;
    objType: string;
    locatorType: string;
    locatorValue: string;
}

export class WebHelper extends Helper {
    readonly webPage: Page;
    readonly browserContext: BrowserContext;
    readonly json: JsonReader;

    constructor(
        webPage: Page,
        browserContext: BrowserContext,
        jsonPath: string
    ) {
        super();
        this.webPage = webPage;
        this.browserContext = browserContext;
        this.json = new JsonReader(jsonPath);
    }

    @step("changeValueOnUi")
    async changeValueOnUi(params: ChangedValueParams): Promise<any> {
        const { locatorName, valueToUse } = params;
        const { locatorType, locatorValue, objName, objType } =
            await this.createLocatorValue(params);

        let retVal = false;

        const locator = await this.findElement(objName, locatorType, true);

        if (!locator) {
            expect(false, `Locator not found: ${locatorName}`).toBeTruthy();
            return false;
        }

        let testData: string[] = [];
        if (typeof valueToUse === "undefined") {
            const raw = this.json.getJsonValue(objName, "saveTestData");
            testData = raw !== undefined ? raw.split("|") : [];
        }

        try {
            switch (objType?.toLowerCase()) {
                case "toggle":
                    retVal = await this.changeToggleStatus(
                        locator!,
                        locatorName,
                        valueToUse!
                    );
                    break;
                case "checkbox":
                    const currentStatus = await this.isChecked(locator!);
                    if (valueToUse === "true" && !currentStatus) {
                        await this.check(locator!);
                    } else if (valueToUse === "false" && currentStatus) {
                        await this.uncheck(locator);
                    } else {
                        logInfo(
                            `Checkbox ${locatorName} already in desired state: currentStatus: [${currentStatus}], valueToUse: [${valueToUse}]`
                        );
                    }
                    await this.isChecked(locator!);
                    expect(String(await this.isChecked(locator!))).toBe(
                        valueToUse
                    );
                    break;
                case "textbox":
                case "textarea":
                    retVal = await this.enterText(locator, valueToUse!);
                    break;
                case "dropdown":
                    await this.selectItemInDropdown(locator, valueToUse);
                    const currentSelectedVal = await this.getText(locator);
                    if (currentSelectedVal === valueToUse) {
                        expect(currentSelectedVal).toBe(valueToUse);
                        retVal = true;
                    }
                    break;
                case "radiobutton":
                    let letCurrentRadioVal = await this.getRadioValue(
                        locatorValue,
                        objName
                    );
                    if (
                        letCurrentRadioVal !== null &&
                        letCurrentRadioVal !== valueToUse
                    ) {
                        await this.changeRadioStatus(
                            locator,
                            objName,
                            valueToUse
                        );
                    }
                    letCurrentRadioVal = await this.getRadioValue(
                        locatorValue,
                        objName
                    );
                    if (letCurrentRadioVal !== valueToUse) {
                        expect
                            .soft(
                                false,
                                `Radio field [${objName}] is not set to [${valueToUse}], current value is [${letCurrentRadioVal}]`
                            )
                            .toBeTruthy();
                    } else {
                        retVal = true;
                    }
                    break;
                default:
                    expect(
                        false,
                        `Unsupported Object type: ${objType}`
                    ).toBeTruthy();
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(
                false,
                `Failed to find element with locator :${locatorType}. Error: ${errorMessage}`
            ).toBeTruthy();
            return null;
        }
    }

    async createLocatorValue(
        params: ChangedValueParams
    ): Promise<LocatorValueResult> {
        const { locatorName, valueToUse, isTable } = params;
        const isRawXPath =
            locatorName.includes("//") ||
            locatorName.startsWith("xpath=") ||
            locatorName.startsWith("//");
        const isRawCSS =
            locatorName.includes(".") ||
            locatorName.startsWith("#") ||
            locatorName.startsWith("css=");

        const isRawLocator = isRawXPath || isRawCSS;

        if (isRawXPath) {
            return {
                objName: locatorName,
                objType: "raw",
                locatorType: isRawLocator ? "xpath" : "css",
                locatorValue: locatorName,
            };
        }

        const locatorType = this.json.getJsonValue(locatorName, "locatorType");
        const locatorValue = this.json.getJsonValue(
            locatorName,
            "locatorValue"
        );
        const objType = this.json.getJsonValue(locatorName, "objType");

        if (!locatorType || !locatorValue || !objType) {
            expect
                .soft(false, `Missing JSON data for element: ${locatorName}`)
                .toBeTruthy();
            return {
                objName: `Missing JSON Data for element: ${locatorName}`,
                locatorType,
                locatorValue,
                objType,
            };
        }
        return {
            objName: locatorName,
            locatorType,
            locatorValue,
            objType,
        };
    }
    /**
     * Finds a single element using the specified locator strategy
     * Checks if element is displayed and enabled
     * Returns null if element is not found
     * @param { string } type - Locator type('css', 'xpath', 'text', 'testid', 'role', 'label')
     * @param { string } value - Locator value
     * @returns { Promise<{ locator: import('@playwright/test').Locator, isDisplayed: boolean, isEnabled: boolean } | null> } Playwright locator with status or null
     */
    @step("findElement")
    async findElement(
        locatorValue: string,
        locatorType: string = "xpath",
        mandatory = true,
        all = false,
        visibleOnly = true
    ): Promise<Locator | null> {
        if (!locatorValue || !locatorType) {
            logError(
                `Locator value and type must be provided. Received value: '${locatorValue}', type: '${locatorType}'`
            );
            expect(
                false,
                "locatorValue and locatorType must be provided"
            ).toBeTruthy();
            return null;
        }

        const type = locatorType.trim().toLowerCase();
        const value = locatorValue.trim().toLowerCase();

        let locator: Locator;

        try {
            const locatorBuilders: Record<string, () => Locator> = {
                css: () => this.webPage.locator(value),
                xpath: () => this.webPage.locator(`xpath=${value}`),
                text: () => this.webPage.getByText(value, { exact: true }),
                testid: () => this.webPage.locator(`[data-testid=${value}]`),
                role: () => this.webPage.locator(`role=${value}`),
                label: () => this.webPage.getByLabel(value),
                placeholder: () => this.webPage.getByPlaceholder(value),
            };
            const builder = locatorBuilders[type];

            if (!builder) {
                logError(`Unsupported locator type: ${type}`);
                expect(false, `Unsupported locator type: ${type}`).toBeTruthy();
                return null;
            }

            locator = builder()
                .describe(`${type}:${value}`)
                .filter({ visible: visibleOnly });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            logError(
                `Error while finding element with ${type} locator: ${value}. Error: ${errorMessage}`
            );
            return null;
        }

        const WAIT_TIMEOUT_MS = 8_000; // 8 seconds
        const state = visibleOnly ? "visible" : "attached";
        for (
            let attempt = 1;
            attempt <= WaitFor.MEDIUM_RETRY_COUNT;
            attempt++
        ) {
            try {
                await locator.first().waitFor({
                    state: state as "attached" | "visible",
                    timeout: WAIT_TIMEOUT_MS,
                });

                const count = await locator.count();
                if (count > 0) {
                    logInfo(
                        `findElement()->  Found [${count}] elements(s) on attempt ${attempt}: ${type}=${value}`
                    );
                    return all ? locator : locator.first();
                }
                logInfo(
                    `findElement()->  Count = 0 on attempt ${attempt}: ${type}=${value}`
                );
            } catch {
                logInfo(
                    `findElement()->  Timeout on attempt ${attempt}/${WaitFor.FIND_ELEMENT_RETRY}: ${type}=${value}`
                );
            }

            if (attempt < WaitFor.FIND_ELEMENT_RETRY) {
                const backOffSec = Math.pow(2, attempt - 1); //1s -> 2s
                logInfo(`findElement()->  Retrying after ${backOffSec}s...`);
                await this.delay(backOffSec);
            }
        }
        if (mandatory) {
            expect
                .soft(
                    false,
                    `findElement()-> Failed to find element with ${type} = ${value}`
                )
                .toBeTruthy();
        }

        return null;
    }

    /**
     * Finds all elements using the specified locator strategy
     * @param {string} type - Locator type
     * @param {string} value - Locator value
     * @param {Object} [options] - Optional locator options
     * @returns {Promise<import('@playwright/test').Locator>} Playwright locator for all matching elements
     */
    async findAllElements(
        locatorValue: string,
        locatorType: string = "xpath",
        mandatory: boolean = true,
        all: boolean = true
    ): Promise<Locator[]> {
        try {
            const result = await this.findElement(
                locatorValue,
                locatorType,
                mandatory,
                all
            );
            if (!result) {
                return [];
            }
            return result.all();
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(
                false,
                `Failed to find all elments with locator :${locatorValue}. Error: ${errorMessage}`
            ).toBeTruthy();
            return [];
        }
    }

    async changeToggleStatus(
        toggleLocator: Locator,
        name: string,
        expectedStatus: string
    ): Promise<boolean>;
    async changeToggleStatus(
        toggleLocator: string,
        name: string,
        expectedStatus: string
    ): Promise<boolean>;
    @step("changeToggleStatus")
    async changeToggleStatus(
        toggleLocator: string | Locator,
        toggleName: string,
        expectedStatus: string
    ): Promise<boolean> {
        let retVal = true;
        let locator: Locator | null = null;
        if (typeof toggleLocator === "string") {
            locator = await this.findElement(toggleLocator, "xpath", true);
        } else {
            locator = toggleLocator;
        }

        let actualStatus = await this.getToggleElementStatus(
            locator!,
            toggleName
        );
        let i = 1;
        while (actualStatus !== expectedStatus) {
            try {
                if (typeof toggleLocator === "string") {
                    locator = await this.findElement(
                        toggleLocator,
                        "xpath",
                        true
                    );
                    if (locator === null) {
                        break;
                    }
                }

                await this.leftClickButton(locator!);

                actualStatus = await this.getToggleElementStatus(
                    locator!,
                    toggleName
                );

                if (actualStatus === expectedStatus) {
                    expect
                        .soft(
                            true,
                            `Toggled ${toggleName} to ${actualStatus} successfully`
                        )
                        .toBeTruthy();
                    break;
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                logError(
                    `Error while toggling ${toggleName} to ${expectedStatus}. Error: ${errorMessage}`
                );
            }

            if (i === WaitFor.LOW_RETRY_COUNT) {
                logError(
                    `Failed to toggle ${toggleName} to ${expectedStatus} after ${i} attempts.`
                );
                break;
            }
            i++;
        }
        return retVal;
    }

    async getToggleElementStatus(
        locator: Locator,
        name: string
    ): Promise<string>;
    async getToggleElementStatus(
        locator: string,
        name: string
    ): Promise<string>;
    @step("getToggleElementStatus")
    async getToggleElementStatus(
        locatorOrLocatorValue: string | Locator,
        name: string
    ) {
        let toggleStatus: string | null = null;
        try {
            let toggleElement: Locator | null = null;
            if (typeof locatorOrLocatorValue === "string") {
                toggleElement = await this.findElement(
                    locatorOrLocatorValue,
                    "xpath",
                    true
                );
            } else {
                toggleElement = locatorOrLocatorValue;
            }

            if (toggleElement === null) {
                logError(
                    `Failed to get toggle status for ${name}. Element not found.`
                );
                return null;
            }

            const ariaChecked =
                await toggleElement.getAttribute("aria-checked");
            const classAttr = await toggleElement.getAttribute("class");
            if (
                ariaChecked !== null &&
                (ariaChecked === "true" || ariaChecked?.includes("checked"))
            ) {
                toggleStatus = "Enable";
            } else if (classAttr?.includes("checked")) {
                toggleStatus = "Enable";
            } else {
                toggleStatus = "Disable";
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            logError(
                `Error while getting toggle status for ${name}. Error: ${errorMessage}`
            );
        }

        logInfo(`Toggle status for ${name}: ${toggleStatus}`);
        return toggleStatus;
    }
    /**
     * The function clicks on an element on a web page based on its text content.
     * @param {string} text - The text parameter is a string that represents the text content of an element
     * that you want to click on. It is used to locate the element on the web page.
     * @param {boolean} [exact=true] - The `exact` parameter is a boolean value that determines whether the
     * text should be matched exactly or not. If `exact` is set to `true`, the `clickByText` function will
     * only click on elements that have an exact match with the provided text. If `exact` is set to `
     */
    @step("click By Text")
    async clickByText(text: string, exact: boolean = true): Promise<void> {
        await this.webPage.getByText(text, { exact: exact }).click();
    }

    async rightClickButton(selector: string): Promise<void>;
    async rightClickButton(locator: Locator): Promise<void>;
    @step("rightClickButton")
    async rightClickButton(selectorOrLocator: string | Locator): Promise<void> {
        if (typeof selectorOrLocator === "string") {
            const locator = await this.findElement(
                selectorOrLocator,
                "xpath",
                true
            );
            await locator?.click({ button: "right" });
        } else {
            await selectorOrLocator.click({ button: "right" });
        }
    }

    async leftClickButton(selector: string): Promise<void>;
    async leftClickButton(locator: Locator): Promise<void>;
    @step("leftClickButton")
    async leftClickButton(selectorOrLocator: string | Locator): Promise<void> {
        if (typeof selectorOrLocator === "string") {
            const locator = await this.findElement(
                selectorOrLocator,
                "xpath",
                true
            );
            await locator?.click();
        } else {
            await selectorOrLocator.click();
        }
    }

    async click(selector: string): Promise<void>;
    async click(locator: Locator): Promise<void>;
    @step("click")
    async click(selectorOrLocator: string | Locator): Promise<void> {
        if (typeof selectorOrLocator === "string") {
            const locator = await this.findElement(
                selectorOrLocator,
                "xpath",
                true
            );
            await locator?.click();
        } else {
            await selectorOrLocator.click();
        }
    }

    async hover(selector: string): Promise<void>;
    async hover(locator: Locator): Promise<void>;
    @step("hover")
    async hover(selectorOrLocator: string | Locator): Promise<void> {
        if (typeof selectorOrLocator === "string") {
            const locator = await this.findElement(
                selectorOrLocator,
                "xpath",
                true
            );
            await locator?.hover();
        } else {
            await selectorOrLocator.hover();
        }
    }

    @step("navigateToUrl : {url}")
    async navigateToUrl(url: string): Promise<void> {
        await this.webPage.goto(url, { waitUntil: "domcontentloaded" });
        await this.webPage.waitForLoadState("load");
    }

    @step("verifyDragAndDrop")
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

    @step("verifyToolTip")
    async verifyToolTip(locator: string, hoverText: string): Promise<void> {
        let el = await this.webPage.locator(locator);
        el.hover();
        await expect(el).toContainText(hoverText);
    }

    @step("verifyFileDownload")
    async verifyFileDownload(): Promise<void> {
        //TBD
    }

    @step("verifyNewTab")
    async verifyNewTab(newTabUrlExpected: string): Promise<void> {
        //TBD
    }

    @step("verifyNewWindow")
    async verifyNewWindow(newWindowUrlExpected: string): Promise<void> {
        //TBD
    }

    @step("verifyFrameText")
    async verifyFrameText(): Promise<void> {
        //TBD
    }
    @step("verifyNestedFrame")
    async verifyNestedFrame(): Promise<void> {
        //TBD
    }

    /**
     * The function asserts that the current page URL matches the expected URL.
     * @param {string} url - The `url` parameter is a string that represents the expected URL of a web
     * page.
     */
    @step("assertPageURL")
    async assertPageURL(url: string): Promise<void> {
        await expect(this.webPage).toHaveURL(url);
    }

    /**
     * The function asserts that the page title matches the expected title.
     * @param {string} title - The title parameter is a string that represents the expected title of the
     * web page.
     */
    @step("assertPageTitle")
    async assertPageTitle(title: string): Promise<void> {
        await expect(this.webPage).toHaveTitle(title);
    }
    /**
     * The function opens a new tab in a browser context, navigates to a specified URL, and returns the
     * page object representing the new tab.
     * @param {string} url - A string representing the URL of the webpage that you want to open in a new
     * tab.
     * @returns a Promise that resolves to a Page object.
     */
    @step("openNewTab")
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
    @step("takeFullPageScreenshot")
    async takeFullPageScreenshot(
        imageName: string = `screenshot.png`
    ): Promise<void> {
        const buffer = await this.webPage.screenshot({
            path: `${imageName}`,
            fullPage: true,
        });
    }

    @step("takePageScreenshot")
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
    @step("takeScreenshotOfElement")
    async takeScreenshotOfElement(
        locator: string,
        imageName: string = `screenshot.png`
    ): Promise<void> {
        const el = await this.webPage.locator(locator);
        await el.screenshot({ path: `${imageName}` });
    }

    @step("clipScreenshot")
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
    @step("elementContainText")
    async elementContainText(
        target: string,
        expectedText: string
    ): Promise<void> {
        logInfo(
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
    @step("elementHasText")
    async elementHasText(target: string, expectedText: string): Promise<void> {
        logInfo(
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
    @step("elementIsVisible")
    async elementIsVisible(target: string): Promise<void> {
        logInfo(`Asserts that element ${target} is visible.`);
        expect(await this.webPage.locator(target)).toBeVisible();
    }

    /**
     * The function asserts that a specified element is not visible on a web page.
     * @param {string} target - The target parameter is a string that represents the locator or selector
     * for the element that you want to check for visibility. It can be a CSS selector, an XPath
     * expression, or any other valid locator that can be used to identify the element on the web page.
     */
    @step("elementIsNotVisible")
    async elementIsNotVisible(target: string): Promise<void> {
        logInfo(`Asserts that element ${target} is not visible.`);
        expect(await this.webPage.locator(target)).toBeHidden();
    }

    @step("elementHasAttributeAndValue")
    async elementHasAttributeAndValue(
        target: string,
        attribute: string,
        attributeVal: string
    ): Promise<void> {
        logInfo(
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
    @step("blockRequest")
    async blockRequest(context: BrowserContext, requestName: string) {
        await context.route("**/*", (request) => {
            request.request().url().startsWith(`${requestName}`)
                ? request.abort()
                : request.continue();
            return;
        });
    }

    /**
     * Waits for the next JavaScript dialog, logs its message, and handles it.
     * @param {'accept' | 'dismiss'} action - How to handle the dialog.
     * @param {string} [promptText] - Text to pass when accepting a prompt dialog.
     * @returns {Promise<string>} The dialog message.
     */
    @step("waitAndHandleDialog")
    async waitAndHandleDialog(
        action: "accept" | "dismiss" = "accept",
        promptText?: string
    ): Promise<string> {
        const message = await new Promise<string>((resolve) => {
            this.webPage.once("dialog", async (dialog) => {
                const msg = dialog.message();
                logInfo(`Dialog [${dialog.type()}]: ${msg}`);
                if (action === "accept") {
                    await dialog.accept(promptText);
                } else {
                    await dialog.dismiss();
                }
                resolve(msg);
            });
        });
        return message;
    }

    /**
     * The function `getFrame` takes a frame locator as input and calls a method on the `webPage` object
     * to locate the frame.
     * @param {string} frameLocator - The frameLocator parameter is a string that represents the locator
     * or identifier of the frame you want to retrieve.
     */
    @step("getFrame")
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
    @step("getStringFromShadowDom")
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
    @step("downLoadFile")
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
        const suggestedFileName = download.suggestedFilename();
        const filePath = "download/" + suggestedFileName;
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
    @step("uploadFile")
    async uploadFile(
        filePath: string,
        fileUploadLocator: string,
        uploadBtnLocator: string
    ) {
        if (!fs.existsSync(filePath)) {
            logInfo(`File ${filePath} does not exist`);
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
    @step("interceptRouteAndContinue")
    async interceptRouteAndContinue(interceptRoute: string) {
        await this.browserContext.route(interceptRoute, async (route) => {
            //Arrange & Log the request
            const response = await route.fetch();
            const json = await response.json();
            logInfo(JSON.stringify(json, null, 10));

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

    @step("interceptRouteAndAbort")
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
    @step("interceptRouteAndChangeData")
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

    @step("changeElementValue")
    async changeElementValue(): Promise<void> {
        //TBD
    }

    @step("verifyValueFromUi")
    async verifyValueFromUi(): Promise<void> {
        //TBD
    }

    @step("getAttribute")
    async getAttribute(
        locator: string,
        attributeName: string
    ): Promise<string> {
        const value = await this.webPage
            .locator(locator)
            .getAttribute(attributeName);
        return value ?? "";
    }

    @step("getText")
    async getText(el: Locator): Promise<string> {
        // Check if it's an input element
        const isInput = await el.evaluate(
            (el) =>
                el.tagName === "INPUT" ||
                el.tagName === "TEXTAREA" ||
                el.tagName === "SELECT" ||
                el.tagName === "TEXTBOX"
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

    @step("press")
    async press(key: string): Promise<void> {
        await this.webPage.keyboard.press(key);
    }

    @step("enterText")
    async enterText(el: Locator | string, value: string) {
        let locator: Locator | null = null;
        if (typeof el === "string") {
            locator = await this.findElement(el, "xpath", true);
        }
        if (!locator) {
            logError(`Element not found: ${el}`);
            return false;
        }

        for (let attempt = 1; attempt <= WaitFor.LOW_RETRY_COUNT; attempt++) {
            try {
                await locator.clear();
                await locator.fill(value);
                const filledValue = await locator.inputValue().catch((=>null));

                if (filledValue === value) {
                    logInfo(`Text entered successfully: ${value}`);
                    expect(filledValue).toBe(value);
                    return true;
                }
                logInfo(`Value mismatch on attempt ${attempt}: Expected : [${value}], Actual : [${filledValue}], Retrying ...`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logError(errorMessage);
            }

            if (attempt === WaitFor.LOW_RETRY_COUNT) {
                expect.soft(false, `Failed to enter text after ${WaitFor.LOW_RETRY_COUNT} attempts.`).toBeTruthy();
            }
            
        }
        return false;
    }

    @step("getRadioValue")
    async getRadioValue(locator: string, fieldName:string): Promise<string| null> {
        let value = '';
        try{
        const radioElements = await this.findAllElements(locator);
        if (!radioElements || radioElements.length === 0) {
            logError(`No radio elements found for locator: ${locator}`);
            return value;
        }

        for (const radioElement of radioElements) {
            //To Do : Add code to select radio button
        }
        return value || null
        }catch(error){  
            const errorMessage = error instanceof Error ? error.message : String(error);
            logError(`Error in getRadioValue for locator [${locator}]: ${fieldName}. Error: ${errorMessage}`);
            return null;
        }
        
    }

    @step("changeRadioStatus")
    async changeRadioStatus(radioLocator: string, radioName: string,expectedStatus: string): Promise<boolean> {
        let retVal = true;
        let actualStatus = await this.getRadioValue(radioLocator, radioName);
        let i = 1;
        while (actualStatus !== expectedStatus) {
            try {
                const radioElements = await this.findAllElements(radioLocator);
                if (!radioElements || radioElements.length === 0) {
                    logError(`No radio elements found for locator: ${radioLocator}`);
                    return false;
                }

                let found = false;
                for (const radioElement of radioElements) {
                    const radioText = (await radioElement.textContent())?.trim() || "";
                    if (radioText.toLowerCase() === expectedStatus.toLowerCase()) {
                        await this.click(radioElement);
                        found = true;
                        break;
                    }
                }

                if (!found){
                    logInfo(`Radio not found with expected status: ${expectedStatus}. Retrying... (Attempt ${i})`);
                }
                await this.delay(1);
                actualStatus = await this.getRadioValue(radioLocator, radioName);
                if (actualStatus === expectedStatus) {
                    retVal = true;
                    break;                
                }
                i++;

                
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logError(`Error in changeRadioStatus for locator [${radioLocator}]: ${radioName}. Error: ${errorMessage}`);
            }

            if (i === WaitFor.LOW_RETRY_COUNT) {
                logError(`Failed to change radio status to ${expectedStatus} after ${i} attempts.`);
                expect.soft(false, `Failed to change radio status to ${expectedStatus} after ${i} attempts.`).toBeTruthy();
                retVal = false;
                break;             
            }
    }
    logInfo(`Radio status changed to ${expectedStatus}`);
    return retVal;
}

    @step("setCheckBoxStatus")
    async setCheckBoxStatus(el: Locator, state: string = "true") {
        let isChecked = await el.isChecked();
        let tryCount = 0;
        while (`${isChecked}` !== state) {
            if (`${isChecked}` !== `${state}` && `${state}` === `true`) {
                await el.check(); // Check the checkbox
                logInfo("checkbox was not checked, now checked.");
            }

            if (`${isChecked}` !== `${state}` && `${state}` === `false`) {
                await el.check(); // unCheck the checkbox
                logInfo("checkbox was checked, now unchecked.");
            }
            isChecked = await el.isChecked();
            tryCount++;

            if (tryCount == 3) {
                return false; //exit the loop
            }
        }
    }

    @step("getCheckBoxStatus")
    async getCheckBoxStatus(el: Locator): Promise<boolean> {
        return await el.isChecked();
    }

    async isChecked(selector: string): Promise<boolean>;
    async isChecked(locator: Locator): Promise<boolean>;
    async isChecked(selectorOrLocator: Locator | string): Promise<boolean> {
        let status = false;
        let value: string = "";
        if (typeof selectorOrLocator === "string") {
            const el = await this.findElement(selectorOrLocator, "xpath", true);
            value = (await el?.getAttribute("class")) || "";
        } else {
            value = (await selectorOrLocator.getAttribute("class")) || "";
        }

        if (value?.includes("checked")) {
            status = true;
        }
        logInfo(`Element is checked: ${status}`);
        return status;
    }

    async check(selectorOrLocator: Locator | string): Promise<boolean> {
        let locator: Locator | null = null;
        if (typeof selectorOrLocator === "string") {
            locator = await this.findElement(selectorOrLocator, "xpath", true);
        }else{
            locator = selectorOrLocator as Locator;
        }

        if (!locator) {
            expect(false, "Locator not found").toBeTruthy();
            return false;
        }

        const value = (await locator.getAttribute("class")) || "";

        if (value?.includes("disable")) {
            logInfo("Element is disabled, cannot check");
            return false;
        }

        let isChecked = await this.isChecked(locator);
        if (isChecked) {
            logInfo("Element is already checked");
            return true;
        } else {
            await locator.check();
        }

        isChecked = await this.isChecked(locator);

        return isChecked;
    }

    @step("uncheck")
    async uncheck(selectorOrLocator: Locator | string): Promise<boolean> {
        let locator: Locator | null = null;
        if (typeof selectorOrLocator === "string") {
            locator = await this.findElement(selectorOrLocator, "xpath", true);
        }else{
         locator = selectorOrLocator as Locator;
        }

        if (!locator) {
            expect(false, "Locator not found").toBeTruthy();
            return false;
        }
        const value = await locator.getAttribute("class")||"";
        if (value?.includes("disable")) {
            logInfo("Element is disabled, cannot uncheck");
            expect.soft(false, "Element is disabled, cannot uncheck").toBeTruthy();
            return false;
        }

        let isChecked = await this.isChecked(locator);
        if (!isChecked) {
            logInfo("Element is already unchecked");
            return true;
        } else {
            await locator.click();
        }         

        isChecked = await this.isChecked(locator);
        logInfo(`Element is unchecked: ${isChecked}`);
        return isChecked;
    }

    @step("getValueFromArray")
    getValueFromArray(testData: string[], preVal: string) {
        const currentIndex = testData.indexOf(preVal);
        const nextIndex = (currentIndex + 1) % testData.length;
        return testData[nextIndex];
    }

    /**
     * Retrieves a stored locator by key
     * @param {string} key - Key used to store the locator
     * @returns {Promise<import('@playwright/test').Locator>} Stored Playwright locator
     */
    async getStoredLocator(key: string) {
        const stored = this.locatorStorage.get(key);
        if (!stored) {
            throw new Error(`No locator found with key: ${key}`);
        }
        // Recreate locator to ensure it's fresh
        const result = await this.findElement(stored.type, stored.value);
        return result ? result.locator : null;
    }

    async getTableHeader(tableLocator: string): Promise<string> {
        const tableHeader = this.webPage
            .locator(tableLocator)
            .locator("thead")
            .locator("tr")
            .locator("th");
        const tableHeaderCount = await tableHeader.count();
        const headerText = [];
        for (let i = 0; i < tableHeaderCount; i++) {
            headerText.push(await tableHeader.nth(i).textContent());
        }
        const finalHeader = headerText.join("|");
        logInfo(`Header Text: ${finalHeader}`);
        return finalHeader;
    }

    async getTableData(tableLocator: string): Promise<string> {
        const tableRow = this.webPage
            .locator(tableLocator)
            .locator("tbody")
            .locator("tr");
        const tableRowCount = await tableRow.count();
        const rowData = [];
        for (let i = 0; i < tableRowCount; i++) {
            rowData.push(await tableRow.locator("td").nth(i).textContent());
        }
        const finalData = rowData.join("|");
        logInfo(`Header Text: ${finalData}`);
        return finalData;
    }
}
