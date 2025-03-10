import { expect, test, APIRequestContext } from "@playwright/test";

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

test("Get booking list and verify response -- No Authentication Required ", async ({
  request,
}) => {
  /* Test Flow
    1. Hit API endpoint
    2. Verify API status code
    3. Verify JSON Response
    4. Verify JSON Schema
  */
  test.info().annotations.push({
    type: "purpose",
    description:
      "This will make GET call to https://restful-booker.herokuapp.com/booking with no authentication",
  });
  const apiHelper = await new ApiHelper(request); //
  const responseMsg = await apiHelper.invokeGetApi("/booking");
  console.log(JSON.stringify(responseMsg));
  for (let index = 0; index < responseMsg.length; index++) {
    test.info().annotations.push({
      type: "value",
      description: `BookingId : ${responseMsg[index].bookingid}`,
    });
    expect(responseMsg[index].bookingid).not.toBeNull();
  }
});

test("Get Booking Details using BookingID --> 1914", async ({ request }) => {
  /* Test Flow
    1. Hit API endpoint
    2. Verify API status code
    3. Verify JSON Response
    4. Verify JSON Schema
  */
  test.info().annotations.push({
    type: "purpose",
    description:
      "This will make GET call to https://restful-booker.herokuapp.com/booking/:id and verify keys/values in response",
  });

  const apiHelper = await new ApiHelper(request); //
  const bookingDetails = await apiHelper.invokeGetApi("/booking/1914");
  console.log(JSON.stringify(bookingDetails));

  expect(bookingDetails.firstname).toBe("John");
  expect(bookingDetails.lastname).toBe("Allen");
  expect(bookingDetails.totalprice).toBe(111);
  expect(bookingDetails.depositpaid).toBeTruthy();
  expect(apiHelper.isValidDate(bookingDetails.bookingdates.checkin)).toBe(true);
  expect(apiHelper.isValidDate(bookingDetails.bookingdates.checkout)).toBe(
    true
  );
  expect(bookingDetails.additionalneeds).toBe("super bowls");
});

test("Get booking list, pass to booking/:id API and verify response -- No Authentication Required ", async ({
  request,
}) => {
  /* Test Flow
    1. Hit API endpoint
    2. Verify API status code
    3. Verify JSON Response
    4. Verify JSON Schema
  */
  test.info().annotations.push({
    type: "purpose",
    description:
      "This will make GET call to https://restful-booker.herokuapp.com/booking with no authentication",
  });
  const apiHelper = await new ApiHelper(request); //
  const responseMsg = await apiHelper.invokeGetApi("/booking");
  console.log(JSON.stringify(responseMsg));
  for (let index = 0; index < responseMsg.length; index++) {
    test.info().annotations.push({
      type: "value",
      description: `BookingId : ${responseMsg[index].bookingid}`,
    });
    expect(responseMsg[index].bookingid).not.toBeNull();
    let bookingDetail = await apiHelper.invokeGetApi(
      `/booking/${responseMsg[index].bookingid}`
    );
    console.log(JSON.stringify(bookingDetail));
  }
});
//API used for writing test code - https://restful-booker.herokuapp.com/apidoc/index.html
