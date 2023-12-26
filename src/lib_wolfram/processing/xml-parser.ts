import { parseString } from "xml2js";
import { MLSubPod, WolframMathMLResponseObject, WolframPlainResponseObject } from "../models/parts/response-types.js";
import { isDefined, isObject } from "../../utils.js";
import { DesiredAction } from "../models/parts/desired-action-types.js";
import { MathMLToLaTeX } from 'mathml-to-latex';
import xml2js from "xml2js";

export class DataProcesser {
    private xml: any;
    public xmlToObjectPlain(xml: string): WolframPlainResponseObject {
        parseString(xml, (err, result) => {
            if (err) {
                console.error(`Error parsing XML ${xml}`, err);
                return;
            };
            this.xml = result;
        });
        if (isObject(this.xml)) {
            return this.xml as WolframPlainResponseObject;
        } else {
            throw new Error(`Object was not properly made!`);
        };
    };
    public xmlToObjectMathML(xml: string): WolframMathMLResponseObject {
        parseString(xml, (err, result) => {
            if (err) {
                console.error(`Error parsing XML ${xml}`, err);
                return;
            };
            this.xml = result;
        });
        if (isObject(this.xml)) {
            return this.xml as WolframMathMLResponseObject;
        } else {
            throw new Error(`Object was not properly made!`);
        };
    };
    public checkSuccess(xmlObject: WolframPlainResponseObject) { xmlObject.queryresult.$.success && !xmlObject.queryresult.$.error ? true : false };
    public checkInput(xmlObject: WolframPlainResponseObject, input: string) { return xmlObject.queryresult.$.inputstring === `${xmlObject.queryresult.$.datatypes.toLowerCase()} ${input}` };
    public extractFullSolution(xmlObject: WolframPlainResponseObject, desiredAction: DesiredAction): string {
        const podArray = xmlObject.queryresult.pod;
        switch (desiredAction) {
            case "solve":
                const resultsPod = podArray.find(pod => pod.$.title === 'Results');
                if (isDefined(resultsPod)) {
                    const possibleStepsPod = resultsPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod.plaintext[0];
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "min":
                const gloabalMinimaPod = podArray.find(pod => pod.$.title === 'Global minima');
                if (isDefined(gloabalMinimaPod)) {
                    const possibleStepsPod = gloabalMinimaPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod.plaintext[0];
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "integrate":
                const gloablMinimaPod = podArray.find(pod => pod.$.title === 'Indefinite integrals');
                if (isDefined(gloablMinimaPod)) {
                    const possibleStepsPod = gloablMinimaPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod.plaintext[0];
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "partial+fractions+":
                const partFrac = podArray.find(pod => pod.$.title === 'Results');
                if (isDefined(partFrac)) {
                    const possibleStepsPod = partFrac.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod.plaintext[0];
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
        };
    };
    public extractFullMLSolution(xmlObject: WolframMathMLResponseObject, desiredAction: DesiredAction): MLSubPod {
        const podArray = xmlObject.queryresult.pod;
        switch (desiredAction) {
            case "solve":
                const resultsPod = podArray.find(pod => pod.$.title === 'Results');
                if (isDefined(resultsPod)) {
                    const possibleStepsPod = resultsPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod;
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "min":
                const gloabalMinimaPod = podArray.find(pod => pod.$.title === 'Global minima');
                if (isDefined(gloabalMinimaPod)) {
                    const possibleStepsPod = gloabalMinimaPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod;
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "integrate":
                const gloablMinimaPod = podArray.find(pod => pod.$.title === 'Indefinite integrals');
                if (isDefined(gloablMinimaPod)) {
                    const possibleStepsPod = gloablMinimaPod.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod;
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
            case "partial+fractions+":
                const partFrac = podArray.find(pod => pod.$.title === 'Results');
                if (isDefined(partFrac)) {
                    const possibleStepsPod = partFrac.subpod.find(subpod => subpod.$.title === 'Possible intermediate steps');
                    if (isDefined(possibleStepsPod)) {
                        return possibleStepsPod;
                    } else {
                        throw new Error("No Possible intermediate steps Pod.")
                    };
                } else {
                    throw new Error("No results Pod.")
                };
        };
    };
    public xmlFullMLToLatex(mlSubPod: MLSubPod): string {
        const builder = new xml2js.Builder();
        const mathObject = builder.buildObject(mlSubPod);
        const latexConversion = MathMLToLaTeX.convert(mathObject);
        return latexConversion;
    };
    public createLineArrayFromLatex(inputString: string): string[] {
        // Replace the "invisible times" character with the LaTeX multiplication symbol
        const stringWithVisibleTimes = inputString.replace(/\u2062/g, '\\times');

        // Split the input string into an array of lines using double backslashes
        const lines = stringWithVisibleTimes.split(/\\\\/);

        // Remove empty lines and trim leading/trailing whitespace from each line
        const cleanedLines = lines
            .filter((line) => line.trim() !== '')
            .map((line) => line.trim());

        // Merge lines until the balance of \begin{matrix} and \end{matrix} is achieved
        const mergedLines: string[] = [];
        let currentLine = '';
        let matrixBalance = 0;

        cleanedLines.forEach((line) => {
            currentLine += ' ' + line;

            const beginMatrixCount = (currentLine.match(/\\begin{matrix}/g) || []).length;
            const endMatrixCount = (currentLine.match(/\\end{matrix}/g) || []).length;

            matrixBalance = beginMatrixCount - endMatrixCount;

            if (matrixBalance === 0) {
                mergedLines.push(currentLine.trim());
                currentLine = '';
            }
        });

        // Push the remaining content if any
        if (currentLine.trim() !== '') {
            mergedLines.push(currentLine.trim());
        }

        return mergedLines;
    }
    public fullUnpack(xml: any, desiredAction: DesiredAction) {
        return this.createLineArrayFromLatex(this.xmlFullMLToLatex(this.extractFullMLSolution(this.xmlToObjectMathML(xml), desiredAction)));
    }
}
