import { FullResultsApi } from "../../src/lib_wolfram/api/full-results";
import { DesiredAction } from "../../src/lib_wolfram/models/parts/desired-action-types";
import { DataProcesser } from "../../src/lib_wolfram/processing/xml-parser";

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
    public static async partialController(req: any, res: any): Promise<void> {
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();

        try {
            const wolframReq = new WolframRequest(req.query.equation, "partial+fractions+");
            const response = await apiFull.getStepByStepSolution({ equation: wolframReq.equation }, wolframReq.desiredAction);
            const exctractedFullSolution = processer.extractFullSolution(processer.xmlToObject(response), wolframReq.desiredAction);
            console.log(`[Success]`, exctractedFullSolution);
            await res.send({ solution: exctractedFullSolution });
        } catch (e) {
            console.log(`Some went wrong here, chief. ${e}`);
        }
    }

    public static async integralController(req: any, res: any): Promise<void> {
        const apiFull = new FullResultsApi();
        const processer = new DataProcesser();

        try {
            const wolframReq = new WolframRequest(req.query.equation, "integrate");
            const response = await apiFull.getStepByStepSolution({ equation: wolframReq.equation }, wolframReq.desiredAction);
            const exctractedFullSolution = processer.extractFullSolution(processer.xmlToObject(response), wolframReq.desiredAction);
            console.log(`[Success]`, exctractedFullSolution);
            await res.send({ solution: exctractedFullSolution });
        } catch (e) {
            console.log(`Some went wrong here, chief. ${e}`);
        }
    }
}