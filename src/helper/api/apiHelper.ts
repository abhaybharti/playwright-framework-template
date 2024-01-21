import { request } from "@playwright/test";
export class ApiHelper {
  private apiContext: any;
  constructor(apiContext: any) {
    this.apiContext = apiContext.newContext();
  }

  async hitApiEndPoint(operationType: string) {
    switch (operationType.toLowerCase()) {
      case "get":
        await this.invokeGetApi();
        break;
      case "post":
        await this.invokePostApi();
        break;
      case "delete":
        await this.invokeDeleteApi();
        break;
      case "put":
        await this.invokePutApi();
        break;

      default:
        break;
    }
  }

  async invokeGetApi() {}
  async invokeDeleteApi() {}
  async invokePostApi() {}
  async invokePutApi() {}
}
