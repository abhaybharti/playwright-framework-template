import { request, expect, APIResponse } from "@playwright/test";
import exp from "constants";
export class ApiHelper {
  private apiContext: any;
  constructor(apiContext: any) {
    this.apiContext = apiContext.newContext();
  }

  async hitApiEndPoint(
    operationType: string,
    endPoint: string,
    payload: object
  ) {
    switch (operationType.toLowerCase()) {
      case "get":
        await this.invokeGetApi(endPoint);
        break;
      case "post":
        await this.invokePostApi(endPoint, payload);
        break;
      case "delete":
        await this.invokeDeleteApi();
        break;
      case "put":
        await this.invokePutApi(endPoint, payload);
        break;

      default:
        break;
    }
  }

  async invokeGetApi(endPoint: string) {
    let response;
    try {
      console.log(`endPoint: , ${endPoint} `);
      response = await this.apiContext.get(endPoint);
      expect(response.status()).toBe(200);
      return await response.json();
    } catch (error) {
      return error;
    }
  }
  async invokeDeleteApi() {}

  /**
   * The function `invokePostApi` is an asynchronous function that sends a POST request to an API
   * endpoint with a payload and returns the response data.
   * @param {string} endPoint - The `endPoint` parameter is a string that represents the URL or endpoint
   * of the API you want to call.
   * @param {object} payload - The `payload` parameter is an object that contains the data to be sent in
   * the request body. It is typically used to send data to the server for processing or to update a
   * resource.
   * @returns the response data as a JSON object if the response status is 200. If there is an error, it
   * will return the error object.
   */
  async invokePostApi(endPoint: string, payload: object) {
    let response;
    try {
      console.log(`endPoint: , ${endPoint} payload :${payload} `);
      response = await this.apiContext.post(endPoint, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(response.status()).toBe(200);
      return await response.json();
    } catch (error) {
      return error;
    }
  }
  async invokePutApi(endPoint: string, payload: object) {
    let response;
    try {
      console.log(`endPoint: , ${endPoint} payload :${payload} `);
      response = await this.apiContext.put(endPoint, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(response.status()).toBe(200);
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  async verifyStatusCode(
    response: APIResponse,
    statusCode: number = 200
  ): Promise<void> {
    await expect(
      response,
      `${statusCode} status code was not displayed`
    ).toBeOK();
  }
}
