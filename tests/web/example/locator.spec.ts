import { test, expect } from "@playwright/test";

/*  playwright built in locators
 example code is run on website -> https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
 In case you want to read more about role refer -> https://www.w3.org/TR/wai-aria-1.2/#role_definitions*/

test("test locator getByRole() @locator", async ({ page: page }) => {
  /*supported role in playwright: 
  "alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|
  "caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|
  "deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|
  "group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|
  "menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|
  "presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"
  "searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|
  "tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem"
  */

  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  );
  await page.getByRole("textbox", { name: "username" }).fill("Admin");
  await page.getByRole("textbox", { name: "password" }).fill("admin123");
  await page.getByRole("button", { name: "Login" }).click({
    button: "left",
  });
});

test("test locator getByPlaceholder() @locator", async ({ page }) => {
  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  );
  await page.getByPlaceholder("Username").fill("Adminplaceholder");
  await page.getByPlaceholder("Password").fill("admin123");

  await page.getByPlaceholder(/Username/).fill("Adminregexp");
  await page.getByPlaceholder(/Password/).fill("admin123");

  await page.getByPlaceholder(/username/i).fill("Admin_reg_ex_ignorecase");
  await page.getByPlaceholder(/Password/i).fill("admin123");

  await page.getByRole("button", { name: "Login" }).click({
    button: "left",
  });

  await page.getByText("Invalid credentials").click();
  expect(await page.getByText("Invalid credentials").count()).toBe(1);
});

test("test locator getByText() @locator", async ({ page }) => {});
test("test locator getByLabel() @locator", async ({ page }) => {});

test("test locator getByAltText() @locator", async ({ page }) => {});
test("test locator getByTitle() @locator", async ({ page }) => {});
test("test locator getByTestId() @locator", async ({ page }) => {});
