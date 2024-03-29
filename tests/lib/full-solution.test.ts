import * as dotenv from "dotenv";
dotenv.config();

import { FullResultsApi } from "../../src/lib_wolfram/api/full-results";
import { DesiredAction } from "../../src/lib_wolfram/models/parts/desired-action-types";
import { DataProcesser } from "../../src/lib_wolfram/processing/xml-parser";
import * as fs from 'fs';
import * as path from 'path';

const relativePath = "Desktop";

const desktopPath: string = path.join(require('os').homedir(), relativePath);
const filePath: string = path.join(desktopPath, 'testResults.txt');

const testName = "[api: FullSolution]" as const;
const timeout = 1000000;
describe(testName, () => {
    try {
        beforeAll(async () => { });
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();
        // it(
        //     `[GET] Get full solution`,
        //     async () => {
        //         const response = await apiFull.getFullSolution({ equation: "+3x-7=11" }, "solve");
        //         console.log(`[Success]`, response);
        //     },
        //     timeout
        // );
        // it(
        //     `[GET] Get SOLVE Step by step solution`,
        //     async () => {
        //         const desiredAction: DesiredAction = "solve";
        //         const response = await apiFull.getStepByStepSolution({ equation: "+3x+7=11" }, "solve");
        //         console.log(`[Success]`, processer.extractFullSolution(processer.xmlToObject(response), desiredAction));
        //         console.log(response)
        //     },
        //     timeout
        // );
        // it(
        //     `[GET] Get MIN Step by step solution`,
        //     async () => {
        //         const desiredAction: DesiredAction = "min";
        //         const response = await apiFull.getStepByStepSolution({ equation: "1/(3-cos(x))" }, desiredAction);
        //         console.log(`[Success]`, processer.extractFullSolution(processer.xmlToObject(response), desiredAction));
        //     },
        //     timeout
        // );

        // For the current project, the two 
        // it(
        //     `[GET] Get INTEGRAL Step by step solution`,
        //     async () => {
        //         const desiredAction: DesiredAction = "integrate";
        //         const response = await apiFull.getStepByStepSolutionMathML({ equation: "(5x+7)/(x^(3)+2x^(2)-x-2)" }, desiredAction);
        //         const fullyUnpacked = processer.fullUnpack(response, desiredAction);
        //         console.log(`[Success]`, fullyUnpacked);
        //     },
        //     timeout
        // );

        // All styles passed
        // it(
        //     `[GET] Get PARTIAL FRACTION Step by step solution (AD HOC)`,
        //     async () => {
        //         const desiredAction: DesiredAction = "partial+fractions+";
        //         const response = await apiFull.getStepByStepSolutionMathML({ equation: "(3x+2)/(x^2-4)" }, desiredAction);
        //         const fullyUnpacked = processer.fullUnpack(response, desiredAction);
        //         console.log(`[Success]`, fullyUnpacked);
        //     },
        //     timeout
        // );
        // it(
        //     `[GET] Get PARTIAL FRACTION Step by step solution (TEXT STYLE)`,
        //     async () => {
        //         const desiredAction: DesiredAction = "partial+fractions+";
        //         const response = await apiFull.getStepByStepSolutionPlain({ equation: "$\\frac{3 x+2}{x^{2}-4}$" }, desiredAction);
        //         console.log(response)
        //         console.log(`[Success]`, processer.extractFullSolution(processer.xmlToObjectPlain(response), desiredAction));
        //     },
        //     timeout
        // );
        it(
            `[GET] Get PARTIAL FRACTION Step by step solution (BOTH)`,
            async () => {
                const desiredAction: DesiredAction = "integrate";
                const responseMathML = await apiFull.getStepByStepSolutionMathML({ equation: "\\frac{1}{(x^2+1)*\\sqrt{x^2-1}}" }, desiredAction);
                // console.log(responseMathML);
                const fullyUnpacked = processer.fullMlUnpack(responseMathML, desiredAction);
                fs.writeFileSync(filePath, fullyUnpacked.latexText.toString());
                console.log(`[Success]`, fullyUnpacked);
            },
            timeout
        );
        // it(
        //     `[GET] Get PLOT`,
        //     async () => {
        //         const desiredAction: DesiredAction = "partial+fractions+";
        //         const response = await apiFull.getStepByStepSolution({ equation: "(5x+7)/(x^(3)+2x^(2)-x-2)" }, desiredAction);
        //         console.log(response)
        //         console.log(`[Success]`, processer.extractFullSolution(processer.xmlToObject(response), desiredAction));
        //     },
        //     timeout
        // );
    } catch (err) {
        console.log("[error]");
        console.log(err);
    } finally { };
});
