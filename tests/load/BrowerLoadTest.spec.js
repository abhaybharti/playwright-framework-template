const withTransactionTimer = async (transactionName, events, userActions) => {
  const startedTime = Date.now();
  await userActions();
  const difference = Date.now() - startedTime;
  events.emit("histogram", transactionName, difference);
};

/**
 * The function `browserloadTest` is an asynchronous function that uses PlayWright to load the Google
 * India homepage and measures the time it takes to load the page.
 * @param page - The `page` parameter is an instance of a PlayWright `Page` object. It represents a
 * single tab or window in the browser and provides methods to interact with the web page.
 * @param userContext - The userContext parameter is an object that contains any user-specific data or
 * context that you want to pass to the test function. It can be used to store information such as user
 * credentials, session tokens, or any other data that is required for the test to run.
 * @param events - The `events` parameter is an object that contains information about the events that
 * occur during the execution of the test. It is used to track and measure the performance of the test.
 */
async function browserloadTest(page, userContext, events) {
  await withTransactionTimer("browserloadTest", events, async () => {
    await page.goto("http://google.co.in");
  });
}
