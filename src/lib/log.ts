import { HasStatus } from "./exceptions.js";
import { SystemParameter } from "../system-parameter.js";
import log4js from "log4js";
import { Request } from "express";
import { endpointArray } from "../router/web.js";
import { jsonReplacer } from "../utils.js";

export interface HasMessage {
    message: string;
}

export class Log {
    protected static isSetConfig: boolean;
    protected static changeSettingConfig(): void {
        Log.isSetConfig = true;
    }
    public static config(): void {
        if (Log.isSetConfig) return;
        const numBackups = Number(SystemParameter.getString("LOG_BACKUPS") ?? 90);
        const config: log4js.Configuration = {
            appenders: {
                info: {
                    type: "dateFile", // Rolls logs based on a configurable time.
                    filename: "./log/info.log", // Path to log to
                    pattern: ".yyyy-MM-dd", // Default already is yyyy-MM-dd. This format means that a change in day (dd) will generate a new logging file. Hence, logging place changes every midnight
                    numBackups, // Number of max log files to keep. Hence, this system logs files for 3 months
                    compress: true, //Compresses files to .gz
                },
                error: {
                    type: "dateFile",
                    filename: "./log/error.log",
                    pattern: ".yyyy-MM-dd",
                    numBackups,
                    compress: true,
                },
                warn: {
                    type: "dateFile",
                    filename: "./log/warn.log",
                    pattern: ".yyyy-MM-dd",
                    numBackups,
                    compress: true,
                },
                request: {
                    type: "dateFile",
                    filename: "./log/request.log",
                    pattern: ".yyyy-MM-dd",
                    numBackups,
                    compress: true,
                },
                mailer: {
                    type: "dateFile",
                    filename: "./log/mailer.log",
                    pattern: ".yyyy-MM-dd",
                    numBackups,
                    compress: true,
                },
            },
            categories: {
                // Defines groups of log events
                default: { appenders: ["info"], level: "info" }, // Level is used to check if category matches level or not.
                info: { appenders: ["info"], level: "info" },
                error: { appenders: ["error"], level: "error" },
                warn: { appenders: ["warn"], level: "warn" },
                request: { appenders: ["request"], level: "info" },
                mailer: { appenders: ["mailer"], level: "info" },
            },
        };
        for (const endpoint of endpointArray) {
            const name = `${endpoint.substring(1)}-request`;
            config.appenders[name] = {
                type: "dateFile",
                filename: `./log/${name}.log`,
                numBackups,
                compress: true,
            };
            config.categories[name] = { appenders: [name], level: "info" };
        }
        log4js.configure(config);
        Log.changeSettingConfig();
    }

    protected static message(message: string | HasStatus | Error): string {
        if (message instanceof HasStatus) {
            return message.message;
        } else if (message instanceof Error) {
            return `${message.name}:${message.message}`;
        }
        return message;
    }
    public static warn(message: string | HasStatus | any, ...obj: any[]): void {
        Log.config();
        log4js.getLogger("warn").warn(Log.message(message), obj);
    }
    public static info(message: string, ...obj: any[]): void {
        Log.config();
        log4js.getLogger("info").info(message, ...obj);
    }
    public static error(message: string | HasStatus | Error, ...obj: any[]): void {
        Log.config();
        log4js.getLogger("error").error(Log.message(message), obj);
    }
    public static async alert(errors: HasMessage[] | any): Promise<void> {
        Log.config();
        const message = errors.map((e: any) => e.message).join("\n--------------------\n");
        Log.error("Log.alert ::" + message);
    }
    /**
     * リクエストの内容をlog出力する。
     * @param {Request} req expressのリクエスト
     * @returns {void}
     */
    public static request(req: Request): void {
        Log.config();
        log4js.getLogger("request").info(`
			method: ${req.method}
			path: ${req.path}
			headers: ${JSON.stringify(req.headers, jsonReplacer, 2)}
			params: ${JSON.stringify(req.push, jsonReplacer, 2)}
			query: ${JSON.stringify(req.query, jsonReplacer, 2)}
			body: ${JSON.stringify(req.body, jsonReplacer, 2)}
			req: ${req.ip}`);
    }
    /**
     * Due to the volume of incoming requests, we have a separate logger for each endpoint for better troubleshooting.
     * @param {string} endpoint
     * @param {Request} req
     * @returns {void}
     */
    public static endpointRequest(endpoint: string, req: Request): void {
        Log.config();
        log4js.getLogger(`${endpoint.substring(1)}-request`).info(`
			method: ${req.method}
			path: ${req.path}
			headers: ${JSON.stringify(req.headers, jsonReplacer, 2)}
			params: ${JSON.stringify(req.push, jsonReplacer, 2)}
			query: ${JSON.stringify(req.query, jsonReplacer, 2)}
			body: ${JSON.stringify(req.body, jsonReplacer, 2)}
			req: ${req.ip}`);
    }
    public static mailer(...args: any[]): void {
        Log.config();
        log4js.getLogger("mailer").info(JSON.stringify(args, jsonReplacer, 2));
    }
}

