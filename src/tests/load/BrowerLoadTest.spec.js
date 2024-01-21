const withTransactionTimer = async (transactionName, events, userActions) => {
  const startedTime = Date.now();
  await userActions();
  const difference = Date.now() - startedTime;
  events.emit("histogram", transactionName, difference);
};

async function browserloadTest(page, userContext, events) {
  await withTransactionTimer("login", events, async () => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await page.getByPlaceholder("Username").click();
    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenAdminPage", events, async () => {
    await page.getByRole("link", { name: "Admin" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenPimPage", events, async () => {
    await page.getByRole("link", { name: "PIM" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenTimePage", events, async () => {
    await page.getByRole("link", { name: "Time" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenRecruitmentPage", events, async () => {
    await page.getByRole("link", { name: "Recruitment" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenMyInfoPage", events, async () => {
    await page.getByRole("link", { name: "My Info" }).click();
    await page.waitForLoadState("domcontentloaded");
  });

  await withTransactionTimer("OpenPerformancePage", events, async () => {
    await page.getByRole("link", { name: "Performance" }).click();
    await page.waitForLoadState("domcontentloaded");
  });
}

module.exports = { browserloadTest };
