export class HasStatus {
    public status = 2; //アンケートサーバ返却用
    public code = 500; //HTTP ステータス
    public mt_code = 50001; //モニタス返却用
    public message = "";
    private otherParams: any[];
    constructor(message?: string, ...otherParams: any[]) {
        this.otherParams = otherParams;
        if (message) {
            this.message = message;
        }
    }
}

export const successApiResponse = {
    201: "Created",
    202: "Accepted",
    204: "No Content",
};
export type SuccessApiResponse = keyof typeof successApiResponse;
export const errorApiResponse = {
    452: "Survey creation failed.",
    453: "MongoDB query failed",
    454: "MongoDB transaction failed",
    455: "Forbidden status change",
    456: "CLI operation was canceled.",
    457: "Mailer operation failed",
    400: "Bad Request",
    401: "Unauthorized.",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    409: "Conflict",
    412: "Precondition Failed",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
};
export type ErrorApiResponse = keyof typeof errorApiResponse;
export const errorApiResponseValues = Object.keys(errorApiResponse).map<ErrorApiResponse>(
    (code) => Number(code) as ErrorApiResponse,
);

export class BaseSuccess {
    public code = 200;
    public statusMessage: string = "Ok";
    public message?: string;
    private otherParams: any[];
    constructor(code?: SuccessApiResponse, message?: string, ...otherParams: any[]) {
        this.otherParams = otherParams;
        if (code) {
            this.code = code;
            this.statusMessage = successApiResponse[code];
        }
        if (message) {
            this.message = message;
        }
    }
}

export class BaseException {
    public code = 999;
    public statusMessage = "Unknown error";
    public message?: string;
    private otherParams: any[];
    constructor(code?: ErrorApiResponse, message?: string, ...otherParams: any[]) {
        this.otherParams = otherParams;
        if (code) {
            this.code = code;
            this.statusMessage = errorApiResponse[code];
        }
        if (message) {
            this.message = message;
        }
    }
}

