import test from "@playwright/test";
import { Console, log } from "console";

let fakePayloadOrders = { data: [], message: "No Users" };

test("Intercept Network call and Fake/Mock API response", async ({ page }) => {
  await page.goto("http://xxxx.com");
  await page.route("http://xxxx.com/abc/ird", async (route) => {
    //go the response
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayloadOrders);

    //send response to browser and override respond body
    route.fulfill({
      status: 200,
      body: body,
    });
  });
});

test("Intercept Network request", async ({ page }) => {
  await page.goto("http://xxxx.com");

  //intercept request send to server & respond by url value passed in route.continue
  await page.route("http://xxxx.com/abc/ird", async (route) => {
    route.continue({
      url: "http://xxxx.com/abc/123455",
    });
  });
});

test.only("Capture Request and Response", async ({ page }) => {
  page.on("request", (request) => {
    console.log(request.url(), request.method());
  });
  page.on("requestfinished", (data) => {
    console.log(data);
  });

  page.on("websocket", (data) => {
    console.log(data.url());
  });

  page.on("console", async (msg) => {
    const values = [];
    for (const arg of msg.args()) values.push(await arg.jsonValue());
    console.log(...values);
  });

  page.on("response", (response) => {
    // console.log(response?.status(), response?.body());
    console.log(response?.status());
  });

  page.on("requestfailed", (request) => {
    console.log(request.url() + " " + request.failure()?.errorText);
  });
  await page.goto("https://www.flipkart.com");
});
