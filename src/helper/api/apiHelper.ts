import { Helper } from "@src/helper/Helper";
import type { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiError } from "@src/utils/error/ErrorManager";
import { validateSchema } from 'playwright-ajv-schema-validator';
import { step } from "@src/utils/report/ReportAction";
import { logError, logInfo } from "@src/utils/report/Logger";

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
  private readonly apiRequest: APIRequestContext;


  /**
   * The constructor function initializes a new context for the API.
   * @param {any} apiContext - The `apiContext` parameter is an object that represents the context of an
   * API. It is used to store and manage information related to the API, such as authentication
   * credentials, request headers, and other configuration settings.
   */
  constructor(apiRequest: APIRequestContext) {
    super();
    this.apiRequest = apiRequest;
  }


  /**
 * Simplified helper for making API requests and returning the status and JSON body.
 * This helper automatically performs the request based on the provided method, URL, body, and headers.
 *
 * @param {Object} params - The parameters for the request.
 * @param {APIRequestContext} params.request - The Playwright request object, used to make the HTTP request.
 * @param {string} params.method - The HTTP method to use (POST, GET, PUT, DELETE).
 * @param {string} params.url - The URL to send the request to.
 * @param {string} [params.baseUrl] - The base URL to prepend to the request URL.
 * @param {Record<string, unknown> | null} [params.body=null] - The body to send with the request (for POST and PUT requests).
 * @param {Record<string, string> | undefined} [params.headers=undefined] - The headers to include with the request.
 * @returns {Promise<{ status: number; body: unknown }>} - An object containing the status code and the parsed response body.
 *    - `status`: The HTTP status code returned by the server.
 *    - `body`: The parsed JSON response body from the server.
 */
  @step('hitApiEndPoint')
  async hitApiEndPoint({
    method,
    endPoint,
    body = null,
    headers,
    statusCode
  }: { method: methodType, endPoint: string, body?: string | null, headers?: string, statusCode: number }): Promise<{ status: number, body: unknown }> {

    let response: APIResponse | null = null;

    const options: {
      data?: Record<string, unknown> | null;
      headers?: Record<string, string>;
    } = {};

    if (body) { options.data = body; }

    if (headers) {
      options.headers = {
        Authorization: `Token ${headers}`,
        "Content-Type": "application/json",
      };
    } else {
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    switch (method.toLowerCase()) {
      case methodType.GET:
        response = await this.invokeGetApi(endPoint, options);
        break;
      case methodType.POST:
        response = await this.invokePostApi(endPoint, body, options);
        break;
      case methodType.DELETE:
        response = await this.invokeDeleteApi(endPoint, options);
        break;
      case methodType.PUT:
        response = await this.invokePutApi(endPoint, body, options);
        break;
      default:
        logError(`Unsupported operation type: ${method}`);
    }

    if (!response) {
      throw new ApiError(`No response received for method ${method} on ${endPoint}`);
    }

    if (!response.ok()) {
      const text = await response.text();
      new ApiError(
        `POST ${endPoint} failed: ${response.status()} ${response.statusText()} | body: ${text}`
      );

      const status = response.status();

      let bodyData: unknown = null;
      const contentType = response.headers()["content-type"] || "";

      try {
        if (contentType.includes("application/json")) {
          bodyData = await response.json();
        } else if (contentType.includes("text/")) {
          bodyData = await response.text();
        }
      } catch (err) {
        console.warn(`Failed to parse response body for status ${status}: ${err}`);
      }

      return { status, body: bodyData };
    }
  }

  @step('invokeGetApi')
  async invokeGetApi(endPoint: string, options: unknown): Promise<APIResponse> {
    try {
      logInfo(`Making GET request to  endPoint:  ${BASE_URL}${endPoint}`);
      const response = await this.apiRequest.get(endPoint, options);
      return await response;
    } catch (error) {
      console.log(error);
      throw new ApiError("Get request failed");
    }
  }

  @step('invokeDeleteApi')
  async invokeDeleteApi(endPoint: string, options: unknown):Promise<APIResponse> {
    let response;
    try {
      logInfo(
        `Making DELETE request to  endPoint:  ${BASE_URL}${endPoint}`
      );
      response = await this.apiRequest.delete(endPoint, options);

      return await response;
    } catch (error) {
      throw new ApiError("Delete request failed");
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
  @step('invokePostApi')
  async invokePostApi(
    endPoint: string,
    body: unknown,
    options: unknown,
  ): Promise<APIResponse> {
    let response;
    try {
      logInfo(
        `Making POST request to  endPoint:  ${BASE_URL}${endPoint}`
      );
      const reqOptions: any = { ...(options as any) };
      if (body !== undefined && body !== null) {
        reqOptions.data = body;
      }
      response = await this.apiRequest.post(endPoint, reqOptions);
      return await response;
    } catch (error) {
      throw new ApiError("Post request failed");
    }
  }

  @step('invokePutApi')
  async invokePutApi(
    endPoint: string,
    payload: unknown,
    options: unknown,
  ): Promise<APIResponse> {
    let response;
    try {
      logInfo(
        `Making PUT request to  endPoint:  ${BASE_URL}${endPoint}`
      );
      const reqOptions: any = { ...(options as any) };
      if (payload !== undefined && payload !== null) {
        reqOptions.data = payload;
      }
      response = await this.apiRequest.put(endPoint, reqOptions);
      return await response;
    } catch (error) {
      throw new ApiError("Post request failed");
    }
  }
}


