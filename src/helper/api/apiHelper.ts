import { Page, expect } from "@playwright/test";
import { Helper } from "@src/helper/Helper";
import { pwApi, test } from 'pw-api-plugin';
import { ApiError } from "@src/utils/error/ErrorManager";
import { validateSchema } from 'playwright-ajv-schema-validator';

enum methodType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
  HEAD = "head",
}

const BASE_URL = "https://restful-booker.herokuapp.com";

export class ApiHelper extends Helper {
  private readonly apiRequest: pwApi;
  private readonly webPage: Page;



  /**
   * The constructor function initializes a new context for the API.
   * @param {any} apiContext - The `apiContext` parameter is an object that represents the context of an
   * API. It is used to store and manage information related to the API, such as authentication
   * credentials, request headers, and other configuration settings.
   */
  constructor(webPage: Page,apiRequest: pwApi) {
    super();
    this.apiRequest = apiRequest;
    this.webPage = webPage;    
  }


  /**
   * The function `hitApiEndPoint` is an asynchronous function that takes in an operation type, an
   * endpoint, a payload, and a status code, and then invokes the corresponding API method based on the
   * operation type.
   * @param {string} method - The `operationType` parameter is a string that specifies the type of
   * operation to be performed on the API endpoint. It can have one of the following values: "get",
   * "post", "delete", or "put".
   * @param {string} endPoint - The `endPoint` parameter is a string that represents the URL or endpoint
   * of the API that you want to hit. It specifies the location where the API is hosted and the specific
   * resource or action you want to perform.
   * @param {object} body - The `payload` parameter is an object that contains the data to be sent in
   * the request body for POST and PUT operations. It can include any relevant information that needs to
   * be sent to the API endpoint.
   * @param {number} statusCode - The `statusCode` parameter is the expected HTTP status code that the
   * API endpoint should return.
   */
  async hitApiEndPoint(
    method: methodType,
    endPoint: string,
    body: object,
    statusCode: number
  ):Promise<any> {
    try {
      switch (method.toLowerCase()) {
        case methodType.GET:
          return await this.invokeGetApi(endPoint, statusCode);          
        case methodType.POST:
          return await this.invokePostApi(endPoint, body, statusCode);          
        case methodType.DELETE:
          return await this.invokeDeleteApi(endPoint, statusCode);          
        case methodType.PUT:
          return await this.invokePutApi(endPoint, body, statusCode);          
        default:
          throw new Error(`Unsupported operation type: ${method}`);          
      }
    } catch (error) {
      throw new ApiError(
        `Unsupported operation type: ${method}`,       
      );
    }
  }

  async invokeGetApi(endPoint: string, statusCode: number = 200) {
    try {
      console.log(`Making GET request to  endPoint:  ${BASE_URL}${endPoint}`);
      const responseGet = await pwApi.get ({request:this.apiRequest, page:this.webPage},`${BASE_URL}${endPoint}`);

      expect(responseGet.status(),`${endPoint}, Expected Status : ${statusCode}, Actual Status : ${responseGet.status()}`).toBe(statusCode);
      return await responseGet.json();      
    } catch (error) {
      console.log(error);
      throw new ApiError("Get request failed");
    }
  }

  async invokeDeleteApi(endPoint: string, statusCode: number = 200) {
    let response;
    try {
      console.log(
        `Making DELETE request to  endPoint:  ${BASE_URL}${endPoint}`
      );
      response = await pwApi.delete({request:this.apiRequest, page:this.webPage},`${BASE_URL}${endPoint}`);
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
      response = await pwApi.post({request:this.apiRequest, page:this.webPage},`${BASE_URL}${endPoint}`, {
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
      response = await pwApi.put({request:this.apiRequest, page:this.webPage},`${BASE_URL}${endPoint}`, {
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
}
  

