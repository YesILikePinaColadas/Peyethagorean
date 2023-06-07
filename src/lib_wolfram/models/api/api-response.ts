// Information on what the codes usually mean can be found at:
// https://restfulapi.net/http-status-codes/

export const successApiResponse = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
};
export type SuccessApiResponse = keyof typeof successApiResponse;

export const errorApiResponse = {
    400: "Bad Request",
    401: "Not Authorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    409: "Conflict",
    412: "Precondition Failed",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error"
};
export type ErrorApiResponse = keyof typeof errorApiResponse;

export const errorApiResponseValues = Object.keys(errorApiResponse).map<ErrorApiResponse>(
    (code) => Number(code) as ErrorApiResponse
);

export const otherApiResponse = {
    301: "Moved Permanently",
    304: "Not Modified",
};
export type OtherApiResponse = keyof typeof otherApiResponse;

export const unknownApiResponse = { 99999: "unknown" };
export type UnknownApiResponse = keyof typeof unknownApiResponse;

export type ApiResponse = SuccessApiResponse | ErrorApiResponse | OtherApiResponse | UnknownApiResponse;

