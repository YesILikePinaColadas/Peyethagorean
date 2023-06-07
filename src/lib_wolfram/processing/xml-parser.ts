import { parseString } from "xml2js";
import { WolframResponseObject } from "../models/parts/response-types";
import { isDefined, isObject } from "../../utils";

export class DataProcesser {
    private xml: any;
    public xmlToObject(xml: string): WolframResponseObject {
        parseString(xml, (err, result) => {
            if (err) {
                console.error(`Error parsing XML ${xml}`, err);
                return;
            };
            this.xml = result;
        });
        if (isObject(this.xml)) {
            return this.xml as WolframResponseObject;
        } else {
            throw new Error(`Object was not properly made!`);
        };
    };
    public checkSuccess(xmlObject: WolframResponseObject) { xmlObject.queryresult.$.success && !xmlObject.queryresult.$.error ? true : false };
    public checkInput(xmlObject: WolframResponseObject, input: string) { return xmlObject.queryresult.$.inputstring === `${xmlObject.queryresult.$.datatypes.toLowerCase()} ${input}` };
    public extractFullSolution(xmlObject: WolframResponseObject): string {
        const podArray = xmlObject.queryresult.pod;
        const resultsPod = podArray.find(pod => pod.$.title === 'Results');
        if (isDefined(resultsPod)) {
            const possibleStepsPod = resultsPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
            if (isDefined(possibleStepsPod)) {
                return possibleStepsPod.plaintext[0];
            } else {
                throw new Error("No Possible intermedia steps Pod.")
            };
        } else {
            throw new Error("No results Pod.")
        };
    };
};
