import { test, request } from "@playwright/test";
import { ApiHelper } from "../../../helper/api/apiHelper";

test("sample get requet", async () => {
  const apiContext = await request.newContext();
  const apiHelper = new ApiHelper(apiContext);
  apiHelper.invokeGetApi("url");
});
