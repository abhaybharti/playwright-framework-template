export interface MakeApiRequestParams {
    method: "get" | "post" | "delete" | "put" | "patch" | "head";
    endPoint: string;
    body?: string | null;
    headers?: string;
    statusCode: string | number;
}
