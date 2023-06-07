import * as dotenv from "dotenv";
dotenv.config();

import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { get, QueryString } from "./request";
import { URL } from "url";
import { SystemParameter } from "../../system-parameter";
import { DesiredAction } from "../models/parts/desired-action";

type WolframApiConfig = {
    baseUrl: string;
    apiKey: string;
};

const baseApiConfig: WolframApiConfig = {
    baseUrl: SystemParameter.getString("WOLFRAM_URL"),
    apiKey: SystemParameter.getString("WOLFRAM_APPID"),
};

export abstract class WolframApi {
    protected baseUrl = baseApiConfig.baseUrl;
    protected apiKey = baseApiConfig.apiKey;
    protected axiosConfig: AxiosRequestConfig = {};
    protected abstract requestUri: string;
    /**
     * Change key or baseUrl
     * @param {ApiConfig} apiConfig
     * @returns {void}
     */
    public changeApiConfig(apiConfig: WolframApiConfig): void {
        const { baseUrl, apiKey } = apiConfig;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    };
    protected makeRequestUrl(urlPaths?: (string | undefined)[]): string {
        const baseUrl = new URL(this.requestUri, this.baseUrl).href;
        if (!urlPaths || urlPaths.length === 0) return baseUrl;
        return `${baseUrl}/${urlPaths.join("/")}`;
    };
    // Why was this fix over here necessary? 

    /**
     * It adds the ApiKey to the headers???
     * @param {AxiosRequestConfig} axiosConfig 
     * @returns {AxiosRequestHeaders}
     */
    protected makeAxiosConfigHeaders(axiosConfig?: AxiosRequestConfig): AxiosRequestHeaders {
        const baseHeaders: AxiosRequestHeaders = {
            "Api-Key": this.apiKey
        };
        return {
            ...baseHeaders,
            ...this.axiosConfig?.headers,
            ...axiosConfig?.headers,
        };
    };
    /**
     * It adds the ApiKey to the headers???
     * @param {AxiosRequestConfig} axiosConfig 
     * @returns {AxiosRequestConfig}
     */
    protected makeAxiosConfig(axiosConfig?: AxiosRequestConfig): AxiosRequestConfig {
        return {
            ...this.axiosConfig,
            ...axiosConfig,
            headers: this.makeAxiosConfigHeaders(),
        };
    };
    /**
     * Attach desired action
     * @param string, DesiredAction}  
     * @returns {string}
     */
    protected makeInputString(input: string, desiredAction: DesiredAction): string {
        return `${desiredAction}${input}`;
    };

    /**
     * [GET]
     */
    protected async get<Response>(id?: string, queries?: QueryString) {
        return get<Response>(this.makeRequestUrl([id]), queries, this.makeAxiosConfig());
    };
    protected async getByTargetPath<Response>(urlPaths?: string[], queries?: QueryString) {
        return get<Response>(this.makeRequestUrl(urlPaths), queries, this.makeAxiosConfig());
    };
}
