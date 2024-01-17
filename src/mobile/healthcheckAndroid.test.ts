import { AppiumHelper } from "./utils/appiumHelper";

const androidCapabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android",
  "appium:appPackage": "com.android.settings",
  "appium:appActivity": ".Settings",
  "appium:locale": "US",
  "appium:language": "en",
};

describe("Healthcheck Android Appium connection", function () {
  let app: AppiumHelper;

  before(async () => {
    app = new AppiumHelper();
    await app.init(androidCapabilities);
  });

  after(async () => {
    await app.quit();
  });

  it("checks battery level on Settings App", async () => {
    const imageButton = await app.findElement("android.widget.ImageButton");
    await imageButton.click();
    const editText = await app.findElement(
      "android=new UiSelector().className(android.widget.EditText)"
    );
    await editText.click();
    await editText.setValue("bat");
    const linearLayout = await app.findElement(
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout[2]/android.widget.ScrollView/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[3]/android.widget.LinearLayout"
    );
    await linearLayout.click();
    const progressBar = await app.findElement(
      "android=new UiSelector().className(android.widget.ProgressBar)"
    );
    await progressBar.isDisplayed();
  });
});
