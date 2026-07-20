import { Helper } from "@src/helper/Helper";
import type { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiError } from "@src/utils/error/ErrorManager";
import type { MakeApiRequestParams } from "@src/utils/types";
import { validateSchema } from "playwright-ajv-schema-validator";
import { step } from "../report/decorators/ReportActions";
import { logError, logInfo, logWarn } from "@src/helper/logger/Logger";
import { WaitFor } from "config/waitFor";

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
    private readonly retries: number;
    private readonly timeout: number;

    /**
     * The constructor function initializes a new context for the API.
     * @param {any} apiContext - The `apiContext` parameter is an object that represents the context of an
     * API. It is used to store and manage information related to the API, such as authentication
     * credentials, request headers, and other configuration settings.
     */
    constructor(
        apiRequest: APIRequestContext,
        config?: { timeout?: number; retries?: number }
    ) {
        super();
        this.apiRequest = apiRequest;
        this.timeout = WaitFor.API_TIMEOUT || 30000;
        this.retries = WaitFor.API_RETRY_COUNT || 3;
    }

    /**
     * Simplified helper for making API requests and returning the status and JSON body.
     * This helper automatically performs the request based on the provided method, URL, body, and headers.
     *
     * @param {string} params.method - The HTTP method to use (POST, GET, PUT, DELETE).
     * @param {string} params.url - The URL to send the request to.
     * @param {string} [params.baseUrl] - The base URL to prepend to the request URL.
     * @param {Record<string, unknown> | null} [params.body=null] - The body to send with the request (for POST and PUT requests).
     * @param {Record<string, string> | undefined} [params.headers=undefined] - The headers to include with the request.
     * @returns {Promise<{ status: number; body: unknown }>} - An object containing the status code and the parsed response body.
     *    - `status`: The HTTP status code returned by the server.
     *    - `body`: The parsed JSON response body from the server.
     */
    @step("makeApiRequest")
    async makeApiRequest({
        method,
        endPoint,
        body = null,
        headers,
        statusCode,
    }: MakeApiRequestParams): Promise<{ status: number; body: unknown }> {
        let response: APIResponse | null = null;

        const expectedStatusCodes = new Set(
            String(statusCode)
                .split("|")
                .map((code) => parseInt(code.trim()))
        );

        logInfo(
            `Making ${method} request to ${BASE_URL}${endPoint} with body: ${body} with headers: ${headers} and expecting status code(s): ${[...expectedStatusCodes].join("| ")}`
        );

        const options: {
            data?: Record<string, unknown> | null;
            headers?: Record<string, string>;
        } = {};

        if (body) {
            options.data = JSON.parse(body);
        }

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

        const executeRequset = async (): Promise<APIResponse> => {
            switch (method.toLowerCase()) {
                case methodType.GET:
                    return await this.apiRequest.get(endPoint, options);
                case methodType.POST:
                    return await this.apiRequest.post(endPoint, options);
                case methodType.DELETE:
                    return await this.apiRequest.delete(endPoint, options);
                case methodType.PUT:
                    return await this.apiRequest.put(endPoint, options);
                default:
                    throw new Error(`Unsupported operation type: ${method}`);
            }
        };

        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                response = await executeRequset();
            } catch (error) {
                const backOffSec = Math.pow(2, attempt - 1); //1s -> 2s
                logWarn(
                    `Attempt ${attempt} failed for ${method} ${endPoint}: ${error}. Retrying in ${backOffSec} seconds...`
                );
                await this.delay(backOffSec);
                continue;
            }

            if (response && expectedStatusCodes.has(response.status())) {
                break;
            }
        }

        if (!response) {
            throw new ApiError(
                `No response received for method ${method} on ${endPoint}`
            );
        }

        if (!response.ok()) {
            const text = await response.text();
            new ApiError(
                `POST ${endPoint} failed: ${response.status()} ${response.statusText()} | body: ${text}`
            );
        }
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
            console.warn(
                `Failed to parse response body for status ${status}: ${err}`
            );
        }

        return { status, body: bodyData };
    }

    getResponseHeader(response: APIResponse) {
        return response.headers();
    }

    validateSchema(response: APIResponse, schema: object) {}
}
