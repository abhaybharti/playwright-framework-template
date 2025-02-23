import { expect, APIResponse,APIRequestContext } from "@playwright/test";
import { logInfo } from "utils/report/Logger";
import { Helper } from "helper/Helper";
import ErrorManager, { AppError } from "utils/error/ErrorManager";

enum OperationType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}
;
export class ApiHelper extends Helper {
  private apiContext: APIRequestContext;
  private response:ApiResponse<any>;

  constructor(apiContext: any) {
    super();
    this.apiContext = apiContext;    
  }
  async hitApiEndPoint(
    operationType: OperationType,
    endPoint: string,
    payload: object,    
  ): Promise<ApiResponse<any>> {
    
    try {
      switch (operationType.toLowerCase()) {
        case OperationType.GET:
          this.response = await this.get(endPoint);          
           break;
        case OperationType.POST:
           await this.post(endPoint, payload);          
           break;
        case OperationType.DELETE:
           await this.delete(endPoint);          
           break;
        case OperationType.PUT:
          await this.put(endPoint, payload);          
          break;
        default:
          throw new Error(`Unsupported operation type: ${operationType}`);          
      }
      logInfo(`Successfully completed ${OperationType} request to ${endPoint}`, {
        status: this.response.status,
      });      
    } catch (error) {
      this.handleApiError(error);
    }
    return this.response;
  }

  async get<T>(endpoint: string):Promise<ApiResponse<T>> {
    return this.request<T>(OperationType.GET, endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(OperationType.POST, endpoint, data);
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(OperationType.PUT, endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(OperationType.DELETE, endpoint);
  }

  async patch(endpoint: string, data: any) {
    const response = await this.apiContext.patch(endpoint, {
      data
    });
    return {
      status: response.status(),
      data: await response.json()
    };
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

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    logInfo(`Making ${method} request to ${url}`, { body });

    const response = await wrapAsync(
      async () => {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          throw new ApiError(
            `Request failed with status ${res.status}`,
            res.status,
            await res.json()
          );
        }

        const headers: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          headers[key] = value;
        });

        return {
          data: await res.json(),
          status: res.status,
          headers,
        };
      },
      `Failed to ${method} ${endpoint}`
    );

    logInfo(`Successfully completed ${method} request to ${url}`, {
      status: response.status,
    });
    return response;
  }
}
