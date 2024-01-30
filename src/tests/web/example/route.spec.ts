import test from "@playwright/test";

let fakePayloadOrders = { data: [], message: "No Users" };

test("Intercept Network call and Fake API response", async ({ page }) => {
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
