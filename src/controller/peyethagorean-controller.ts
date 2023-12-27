import { FullResultsApi } from "./../lib_wolfram/api/full-results.js";
import { DesiredAction } from "./../lib_wolfram/models/parts/desired-action-types.js";
import { DataProcesser } from "./../lib_wolfram/processing/xml-parser.js";

export class WolframRequest {
    public equation: string
    public desiredAction: DesiredAction
    constructor(receivedEquation: string, desire: DesiredAction) {
        this.equation = receivedEquation;
        this.desiredAction = desire;
    }
};

export type HololensResponseObject = {

}

export default class PeyethagoreanController {
    public static async partialHandler(req: any, res: any): Promise<void> {
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();

        try {
            const response = await apiFull.getStepByStepSolutionMathML({ equation: req.query.equation }, "partial+fractions+");
            const exctractedFullSolution = processer.fullUnpack(response, "partial+fractions+");
            console.log(`[Success]`, exctractedFullSolution);
            await res.send({ solution: exctractedFullSolution });
        } catch (e) {
            console.log(`Some went wrong here, chief. ${e}`);
        }
    }

    public static async integralHandler(req: any, res: any): Promise<void> {
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();

        try {
            const response = await apiFull.getStepByStepSolutionMathML({ equation: req.query.equation }, "integrate");
            const exctractedFullSolution = processer.fullUnpack(response, "integrate");
            console.log(`[Success]`, exctractedFullSolution);
            await res.send({ solution: exctractedFullSolution });
        } catch (e) {
            console.log(`Some went wrong here, chief. ${e}`);
        }
    }
}