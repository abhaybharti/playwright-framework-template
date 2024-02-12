import { expect, test } from "@playwright/test";
import { ApiHelper } from "../../../helper/api/apiHelper";

let token: string;
let bookingId: string;

test.beforeAll(async ({ request }) => {
  //1. Hit /Auth Api and provide username/password as body
  //2. fetch token value from JSON response
  //3. save in token variable
  const apiHelper = await new ApiHelper(request);
  const responseMsg = await apiHelper.invokePostApi("/auth", {
    username: "admin",
    password: "password123",
  });

  expect(responseMsg.token);

  token = responseMsg.token;
  console.log(token);
});

test("Get List of booking and verify response", async ({ request }) => {
  /* Test Flow
    1. Hit API endpoint
    2. Verify API status code
    3. Verify JSON Schema
  */
  const apiHelper = await new ApiHelper(request); //
  const responseMsg = await apiHelper.invokeGetApi("/booking");
  console.log(responseMsg);
});

//API used for writing test code - https://restful-booker.herokuapp.com/apidoc/index.html
