import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { isDefined, isArray, isObject } from "../../../utils.js";
import { ErrorApiResponse, errorApiResponseValues } from "../../models/api/api-response.js";
import { ErrorResponse, ErrorWithErrors } from "../../models/api/response.js";
import { WolframApiInvalidError } from "../index.js";
import { Api } from "../../models/api/index.js";


const isErrorAPIResponse = (value?: any): value is ErrorApiResponse => {
    return value && errorApiResponseValues.includes(value);
};

const getErrors = (data?: any): ErrorWithErrors[] => {
    if (!isDefined(data) || typeof data !== "object") return [];
    const errors: ErrorWithErrors[] = [];
    for (const key in data) {
        if (key === "errors") {
            errors.push(...data[key]);
            continue;
        }
        const d = data[key];
        if (isObject(d)) {
            const _errors = getErrors(d);
            if (_errors.length) errors.push({ field: key, errors: _errors });
            continue;
        }
        if (isArray(d)) {
            d.forEach((_d) => {
                const _errors = getErrors(_d);
                if (_errors.length) errors.push({ field: key, errors: [..._errors] })
            });
            continue;
        }
    }
    return errors;
};

const errorResponse = (err: AxiosError) => {
    const res = err.response;
    const responseBody = res?.data;
    const status = res?.status ?? 1;
    const responseStatus: ErrorResponse["responseStatus"] = isErrorAPIResponse(status) ? status : 99999;
    const statusText: string = res?.statusText || "unknown";
    const errors: ErrorWithErrors[] = getErrors(responseBody);
    console.error(err);
    switch (responseStatus) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 406:
        case 409:
        case 412:
        case 422:
        case 429:
        case 500:
            return new WolframApiInvalidError({
                status,
                responseStatus,
                message: `[${statusText}] An api error occurred.`,
                responseBody,
                errors,
            });
        default:
            return new WolframApiInvalidError({
                status,
                responseStatus,
                message: `[${statusText}] A server error occurred.`,
                responseBody,
                errors,
            });
    }
};



export type QueryString = { [key: string]: string | (number | string)[] | number };

export const makeQueryString = (queries?: QueryString): string => {
    if (!queries) return "";
    const tmp: string[] = [];
    for (const [key, val] of Object.entries(queries)) {
        if (!val) continue; // Continue if value is undefined
        if (val instanceof Array) {
            tmp.push(val.map((v) => `${key}[]=${v}`).join("&"));
        } else {
            tmp.push(`${key}=${val}`);
        }
    }
    return `?${tmp.join("&")}`;
}

export const get = async <Response>(
    url: string,
    queries?: QueryString,
    config?: AxiosRequestConfig
): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const tmp: string[] = [];
        if (queries) {
            for (const [key, val] of Object.entries(queries)) {
                if (val instanceof Array) {
                    tmp.push(val.map((v) => `${key}[]=${v}`).join("&"));
                } else {
                    tmp.push(`${key}=${val}`);
                }
            }
        };
        console.log(`${url}${makeQueryString(queries)}`);
        axios
            .get<Response>(`${url}${makeQueryString(queries)}`, config)
            .then((response) => {
                resolve(response.data);
            }) //define better AxiosError here, maybe????
            .catch((err: AxiosError<Api.ErrorResponse>) => {
                reject(errorResponse(err));
            });
    });
};

// Using instanceof looks for a value in the prototype property of said object.