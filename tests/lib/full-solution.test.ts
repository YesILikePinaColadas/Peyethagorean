import * as dotenv from "dotenv";
dotenv.config();

import { FullResultsApi } from "../../src/lib_wolfram/api/full-results";
import { DataProcesser } from "../../src/lib_wolfram/processing/xml-parser";

const testName = "[api: FullSolution]" as const;
const timeout = 1000000;
describe(testName, () => {
    try {
        beforeAll(async () => { });
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();
        it(
            `[GET] Get full solution`,
            async () => {
                const response = await apiFull.getFullSolution({ equation: "+3x-7%3D11" }, "solve");
                console.log(`[Success]`, response);
            },
            timeout
        );
        it(
            `[GET] Get Step by step solution`,
            async () => {
                const response = await apiFull.getStepByStepSolution({ equation: "+3x-7%3D11" }, "solve");
                console.log(`[Success]`, processer.extractFullSolution(processer.xmlToObject(response)));
            },
            timeout
        );
    } catch (err) {
        console.log("[error]");
        console.log(err);
    } finally { };
});
