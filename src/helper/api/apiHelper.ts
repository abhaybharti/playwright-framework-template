import { expect, APIResponse } from "@playwright/test";
import { Helper } from "helper/Helper";
import ErrorManager, { AppError } from "utils/error/ErrorManager";

enum OperationType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
}

// const BASE_URL = "https://restful-booker.herokuapp.com";
const BASE_URL = "https://www.rabstract.com";
export class ApiHelper extends Helper {
  private apiContext: any;



  /**
   * The constructor function initializes a new context for the API.
   * @param {any} apiContext - The `apiContext` parameter is an object that represents the context of an
   * API. It is used to store and manage information related to the API, such as authentication
   * credentials, request headers, and other configuration settings.
   */
  constructor(apiContext: any) {
    super();
    this.apiContext = apiContext;
    // this.apiContext = apiContext({
    //   extraHTTPHeaders: {
    //     Authorization: `Bearer 12345`,
    //     "Content-Type": `application/json`,
    //   },
    // });
  }

  /**
   * The function `hitApiEndPoint` is an asynchronous function that takes in an operation type, an
   * endpoint, a payload, and a status code, and then invokes the corresponding API method based on the
   * operation type.
   * @param {string} operationType - The `operationType` parameter is a string that specifies the type of
   * operation to be performed on the API endpoint. It can have one of the following values: "get",
   * "post", "delete", or "put".
   * @param {string} endPoint - The `endPoint` parameter is a string that represents the URL or endpoint
   * of the API that you want to hit. It specifies the location where the API is hosted and the specific
   * resource or action you want to perform.
   * @param {object} payload - The `payload` parameter is an object that contains the data to be sent in
   * the request body for POST and PUT operations. It can include any relevant information that needs to
   * be sent to the API endpoint.
   * @param {number} statusCode - The `statusCode` parameter is the expected HTTP status code that the
   * API endpoint should return.
   */
  async hitApiEndPoint(
    operationType: OperationType,
    endPoint: string,
    payload: object,
    statusCode: number
  ):Promise<any> {
    try {
      switch (operationType.toLowerCase()) {
        case OperationType.GET:
          return await this.invokeGetApi(endPoint, statusCode);          
        case OperationType.POST:
          return await this.invokePostApi(endPoint, payload, statusCode);          
        case OperationType.DELETE:
          return await this.invokeDeleteApi(endPoint, statusCode);          
        case OperationType.PUT:
          return await this.invokePutApi(endPoint, payload, statusCode);          
        default:
          throw new Error(`Unsupported operation type: ${operationType}`);          
      }
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async invokeGetApi(endPoint: string, statusCode: number = 200) {
    let response;
    try {
      console.log(`Making GET request to  endPoint:  ${BASE_URL}${endPoint}`);
      response = await this.apiContext.get(`${BASE_URL}${endPoint}`);

      expect(
        response.status(),
        `API : ${BASE_URL}${endPoint} , Expected status : ${statusCode}, Actual status : ${response.status()}`
      ).toBe(statusCode);
      return await response.json();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async invokeDeleteApi(endPoint: string, statusCode: number = 200) {
    let response;
    try {
      console.log(
        `Making DELETE request to  endPoint:  ${BASE_URL}${endPoint}`
      );
      response = await this.apiContext.delete(`${BASE_URL}${endPoint}`);
      expect(
        response.status(),
        `API : ${BASE_URL}${endPoint} , Expected status : ${statusCode}, Actual status : ${response.status()}`
      ).toBe(statusCode);
      return await response.json();
    } catch (error) {
      return error;
    }
  }

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
  async invokePostApi(
    endPoint: string,
    payload: object,
    statusCode: number = 200
  ) {
    let response;
    try {
      let tempPayload = JSON.stringify(payload);
      console.log(
        `Making POST request to  endPoint:  ${BASE_URL}${endPoint} payload :${tempPayload} `
      );
      response = await this.apiContext.post(`${BASE_URL}${endPoint}`, {
        data: payload,
      });
      expect(
        response.status(),
        `API : ${BASE_URL}${endPoint} , Expected status : ${statusCode}, Actual status : ${response.status()}`
      ).toBe(statusCode);
      return await response.json();
    } catch (error) {
      return error;
    }
  }
  async invokePutApi(
    endPoint: string,
    payload: object,
    statusCode: number = 200
  ) {
    let response;
    try {
      console.log(
        `Making PUT request to  endPoint:  ${BASE_URL}${endPoint} payload :${payload} `
      );
      response = await this.apiContext.put(`${BASE_URL}${endPoint}`, {
        data: payload,
      });
      expect(
        response.status(),
        `API : ${BASE_URL}${endPoint} , Expected status : ${statusCode}, Actual status : ${response.status()}`
      ).toBe(statusCode);
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

  async getToken() {
    return "tokenvalue";
  }

  private handleApiError(error: unknown) {
    if (error instanceof Error || error instanceof AppError) {
      ErrorManager.handleError(error);
    } else {
      ErrorManager.handleError(new Error("An unknown error occurred"));
    }
  }
}
