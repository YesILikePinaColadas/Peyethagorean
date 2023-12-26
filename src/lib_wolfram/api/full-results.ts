import { WolframApi } from "./base.js";
import { ApiName } from "./index";
import { BaseEquation } from "../models/parts/equation-types.js";
import { DesiredAction } from "../models/parts/desired-action-types.js";

export const fullResultsApiName: Extract<ApiName, "FullResults"> = "FullResults"; //Why define like this???
export class FullResultsApi extends WolframApi {
    protected requestUri = "v2/query";
    protected name: ApiName = fullResultsApiName;
    /**
     * [GET] Full Raw Solution
     * @param {Equation} equation
     * @returns {Solution} 
     */
    public async getFullSolution(equation: BaseEquation, desiredAction: DesiredAction): Promise<any> {
        const response = await this.getByTargetPath<any>(
            [],
            { appid: this.apiKey, input: this.makeInputString(equation.equation, desiredAction) }
        );
        return response
    };
    /**
     * [GET] Step-by-Step Solution from plain output
     * @param {Equation} equation
     * @returns {Solution} 
     */
    public async getStepByStepSolutionPlain(equation: BaseEquation, desiredAction: DesiredAction): Promise<any> {
        const response = await this.getByTargetPath<any>(
            [],
            { appid: this.apiKey, input: this.makeInputString(equation.equation, desiredAction), podstate: "Step-by-step%20solution", }
        );
        return response
    };
    /**
     * [GET] Step-by-Step Solution from MAthML output
     * @param {Equation} equation
     * @returns {Solution} 
     */
    public async getStepByStepSolutionMathML(equation: BaseEquation, desiredAction: DesiredAction): Promise<any> {
        const response = await this.getByTargetPath<any>(
            [],
            { appid: this.apiKey, input: this.makeInputString(equation.equation, desiredAction), podstate: "Step-by-step%20solution&format=MathML", }
        );
        return response
    };
};
