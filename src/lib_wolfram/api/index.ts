import { ErrorResponse } from "../models/api/response.js";

export class WolframApiInvalidError extends Error {
    constructor(private errorResponse: ErrorResponse, ...params: any[]) {
        super(...params);
        Object.setPrototypeOf(this, WolframApiInvalidError.prototype); // Do not understand the purpose of this line in the constructor
        if (Error.captureStackTrace) { // Tried creating examples but it did not work to show differences.
            Error.captureStackTrace(this, WolframApiInvalidError);
        }
        this.name = "WolframApiInvalidError";
    }
    public getError(): ErrorResponse {
        return this.errorResponse;
    }
};

export type ApiName = "FullResults";

// Extending the Error class is essential for many reasons, one of them is using the captureStackTrace.
