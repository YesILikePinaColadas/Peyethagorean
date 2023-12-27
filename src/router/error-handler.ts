import express from "express";
import { Log } from "../lib/log.js";
import { HasStatus } from "../lib/exceptions.js";
import { endpointArray } from "./web.js";

export const wrap =
    (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) =>
        async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            try {
                if (endpointArray.includes(req.path)) {
                    Log.endpointRequest(req.path, req);
                } else {
                    Log.request(req);
                }
            } catch (e) {
                if (e instanceof HasStatus || e instanceof Error || typeof e === "string") {
                    Log.error(e);
                } else {
                    Log.error("Wrap error", e);
                }
            }
            try {
                await fn(req, res, next);
            } catch (e) {
                if (e instanceof HasStatus) {
                    //エラーコードを持っていれば返す。
                    // errors.map((error) => "・" + Object.values(error.constraints).join("\n")).join("\n");
                    Log.warn(e.message);
                    res.status(e.code).json(e.status);
                    res.end();
                } else {
                    res.status(500).json(2);

                    Log.warn("other error", e);
                    //next(e);
                }
            }
        };

