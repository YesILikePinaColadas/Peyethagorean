import { WolframApi } from "./base";
import { ApiName } from "./index";
import { BaseEquation } from "../models/parts/equation-types";
import { DesiredAction } from "../models/parts/desired-action-types";

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
     * [GET] Step-by-Step Solution
     * @param {Equation} equation
     * @returns {Solution} 
     */
    public async getStepByStepSolution(equation: BaseEquation, desiredAction: DesiredAction): Promise<any> {
        const response = await this.getByTargetPath<any>(
            [],
            { appid: this.apiKey, input: this.makeInputString(equation.equation, desiredAction), podstate: "Step-by-step%20solution", }
        );
        return response
    };
};
