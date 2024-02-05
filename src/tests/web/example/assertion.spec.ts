import { test, expect, request } from "@playwright/test";
import { ApiHelper } from "helper/api/apiHelper";

/*
These assertions will retry until the assertion passes, or the assertion timeout is reached. 
*/
test("Using playwright Auto-Retrying Assertion", async ({ page }) => {
  await page.goto("https://www.google.com");
  await expect(page).toHaveTitle("Google");
  await expect(page.getByTestId("status")).toHaveText("PASS");
  const locator = await page.locator("selector");

  const apiContext = await request.newContext();
  const apiHelper = new ApiHelper(apiContext);
  const response = apiHelper.invokeGetApi("url");

  await expect(locator).toBeAttached(); //Element is attached
  await expect(locator).toBeChecked(); //Checkbox is checked
  await expect(locator).toBeDisabled(); //Element is disabled
  await expect(locator).toBeEditable(); //Element is editable
  await expect(locator).toBeEmpty(); //Container is empty
  await expect(locator).toBeEnabled(); //Element is enabled
  await expect(locator).toBeFocused(); //Element is focused
  await expect(locator).toBeHidden(); //Element is not visible
  await expect(locator).toBeInViewport(); //Element intersects viewport
  await expect(locator).toBeVisible(); //Element is visible
  await expect(locator).toContainText("xyz"); //Element contains text
  await expect(locator).toHaveAttribute("class"); //Element has a DOM attribute
  await expect(locator).toHaveClass("icon"); //Element has a class property
  await expect(locator).toHaveCount(1); //List has exact number of children
  // await expect(locator).toHaveCSS()	//Element has CSS property
  await expect(locator).toHaveId("id"); //Element has an ID
  // await expect(locator).toHaveJSProperty()	//Element has a JavaScript property
  await expect(locator).toHaveScreenshot(); //Element has a screenshot
  await expect(locator).toHaveText("ABC"); //Element matches text
  await expect(locator).toHaveValue("ABC"); //Input has a value
  //await expect(locator).toHaveValues("ABC")	//Select has options selected
  await expect(page).toHaveScreenshot(); //Page has a screenshot
  await expect(page).toHaveTitle("ABC"); //Page has a title
  await expect(page).toHaveURL("ABC"); //Page has a URL
  //await expect(response).toBeOK()	//Response has an OK status
});

/*
These assertions will test any condition but do not auto-retry. Using these assertions can lead to a flaky test 
 
*/
test("Using playwright Non-Retrying Assertion", async ({ page }) => {
  await page.goto("https://www.google.com");
  await expect(page).toHaveTitle("Google");
  const value = "";
  expect(value).toBe(); //Value is the same
  expect(value).toBeCloseTo(); //	Number is approximately equal
  expect(value).toBeDefined(); //Value is not undefined
  expect(value).toBeFalsy(); //Value is falsy, e.g. false, 0, null, etc.
  expect(value).toBeGreaterThan(); //	Number is more than
  expect(value).toBeGreaterThanOrEqual(); //	Number is more than or equal
  expect(value).toBeInstanceOf(); //Object is an instance of a class
  expect(value).toBeLessThan(); //Number is less than
  expect(value).toBeLessThanOrEqual(); //	Number is less than or equal
  expect(value).toBeNaN(); //Value is NaN
  expect(value).toBeNull(); //Value is null
  expect(value).toBeTruthy(); //	Value is truthy, i.e. not false, 0, null, etc.
  expect(value).toBeUndefined(); //	Value is undefined
  expect(value).toContain(); //String contains a substring
  expect(value).toContain(); //Array or set contains an element
  expect(value).toContainEqual(); //Array or set contains a similar element
  expect(value).toEqual(); //Value is similar - deep equality and pattern matching
  expect(value).toHaveLength(); //Array or string has length
  expect(value).toHaveProperty(); //	Object has a property
  expect(value).toMatch(); //String matches a regular expression
  expect(value).toMatchObject(); //	Object contains specified properties
  expect(value).toStrictEqual(); //Value is similar, including property types
  expect(value).toThrow(); //Function throws an error
  expect(value).any(); //Matches any instance of a class/primitive
  expect(value).anything(); //Matches anything
  expect(value).arrayContaining(); //Array contains specific elements
  expect(value).closeTo(); //Number is approximately equal
  expect(value).objectContaining(); //	Object contains specific properties
  expect(value).stringContaining(); //String contains a substring
  expect(value).stringMatching(); //String matches a regular expression
});
