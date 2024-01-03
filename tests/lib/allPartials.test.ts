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

let allResults = "";


const partialEquationsArray = [
    "$\\frac{3 x+2}{x^{2}-4}$",
    // "$\\frac{3x}{2x^2-x-1}$",
    // "$\\frac{5x+7}{x^3+2x^2-x-2}$",
    // "$\\frac{x^2+1}{x(x-1)^3}$",
    // "$\\frac{4x^3+3x^2-2x+1}{x^4-3x^3+x^2+3x-2}$",
];

// const integralEquationsArray = [
//     "(8x-12)(4x^2-12x)^4",
//     "\\frac{4x+3}{4x^2+6x-1}",
//     "(3x^4)(2+4x^3)^7",
//     "\\frac{1}{\\sqrt{4-9x^2}}",
//     "\\frac{1}{\\sqrt{a^2-x^2}}",
//     "\\sqrt{a^2-x^2}",
//     "\\frac{1}{a^2+x^2}",
//     "\\sqrt{a^2+x^2}",
//     "\\sqrt{x^2-a^2}",
//     "\\sqrt{e^{2x}}{1+e^{4x}}",
//     "\\frac{1}{(x^2+1)\\sqrt{x^2-1}}",
//     "\\frac{1}{(sec(x))^2)+2((tan(x))^2)}",
//     "\\frac{1}{x^2-x+1}",
//     "\\frac{1}{1-(sin(x))^4}"

// ]

const testName = "[api: FullSolution]" as const;
const timeout = 1000000;
describe(testName, () => {
    try {
        beforeAll(async () => { });
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();
        for (const equationToSolve of partialEquationsArray) {
            it(
                `[GET] Get PARTIAL FRACTION Step by step solution of equation: ${equationToSolve}`,
                async () => {
                    const desiredAction: DesiredAction = "partial+fractions+";
                    const responseMathML = await apiFull.getStepByStepSolutionMathML({ equation: equationToSolve }, desiredAction);
                    // console.log(responseMathML);
                    const fullyUnpacked = processer.fullMlUnpack(responseMathML, desiredAction);
                    console.log(`[Success]`, fullyUnpacked);
                    allResults = allResults + fullyUnpacked + "\n";
                },
                timeout
            );
        }
        // for (const equationToIntegrate of integralEquationsArray) {
        //     it(
        //         `[GET] Get INTEGRAL Step by step solution of equation: ${equationToIntegrate}`,
        //         async () => {
        //             const desiredAction: DesiredAction = "integrate";
        //             const responseMathML = await apiFull.getStepByStepSolutionMathML({ equation: equationToIntegrate }, desiredAction);
        //             // console.log(responseMathML);
        //             const fullyUnpacked = processer.fullMlUnpack(responseMathML, desiredAction);
        //             console.log(`[Success]`, fullyUnpacked);
        //             allResults = allResults + fullyUnpacked + "\n"
        //         },
        //         timeout
        //     );
        // }
        afterAll(async () => {
            console.log(allResults)
            fs.writeFileSync(filePath, allResults);
        })
    } catch (err) {
        console.log("[error]");
        console.log(err);
    } finally { };
});
