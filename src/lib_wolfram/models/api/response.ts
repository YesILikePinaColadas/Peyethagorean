import { TargetPartial } from "../common";
import { ErrorApiResponse, UnknownApiResponse } from "./api-response";

export type Error = {
    field: string;
    message: string;
};

export type ErrorWithErrors = TargetPartial<Error, "message"> & { errors?: ErrorWithErrors[] };

// It may be that there are several errors inside an error (like an error cascade) so thats what this handles.

export type ErrorResponse = {
    status: number;
    responseStatus: ErrorApiResponse | UnknownApiResponse;
    message: string;
    responseBody?: any;
    request?: any;
    errors?: ErrorWithErrors[];
}