import test from "@playwright/test";
import { Console, log } from "console";

test("iframe", async ({ page }) => {
  await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
  const framesPage = await page.frameLocator("#courses-iframe");
  framesPage.locator("li a[href*='lifetime-access]:visible").click();
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck);
});
