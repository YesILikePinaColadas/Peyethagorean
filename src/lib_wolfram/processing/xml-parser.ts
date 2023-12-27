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
        console.log(mathObject);
        const latexConversion = MathMLToLaTeX.convert(mathObject);
        console.log(latexConversion)
        return latexConversion;
    };
    private processLeftRight(inputString: string): string | undefined {
        // Define the main pattern
        const mainPattern = /\\left\(\\right\.\s*(\D*?)\\left\.\\right\) .*?(?=[\\}])/;
        const secondPattern = /\\left\(\\right\.\s*(\D*?)\\left\.\\right\)/;

        // Perform the first regex test
        const firstMatch = inputString.match(mainPattern);

        if (!firstMatch) {
            // If no match, return the original string
            return inputString;
        }

        console.log(firstMatch)

        // Divide the string into two parts
        const firstPartMatch = firstMatch[0].match(secondPattern);

        if (!firstPartMatch) {
            return inputString;
        }

        const firstPart = firstMatch[0].substring(firstPartMatch[0].length);

        console.log(firstPart);

        // Create the new string
        const newString = `\\left(\\right ${firstPart} \\left.\\right)`;

        // Concatenate the parts to get the final result
        const result = inputString.replace(firstMatch[0], newString);

        console.log(result);

        return this.processLeftRight(result);
    }

    public createLineArrayFromLatex(inputString: string): string[] {
        // Replace the "invisible times" character with the LaTeX multiplication symbol
        const stringWithVisibleTimes = inputString.replace(/\u2062/g, '');

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

            currentLine = this.processLeftRight(currentLine) as string;

            if (matrixBalance === 0) {
                const formattedLine = currentLine.replace(/:/, ': \\\\ \\\\');
                mergedLines.push(formattedLine.trim());
                currentLine = '';

            }
        });

        // Push the remaining content if any
        if (currentLine.trim() !== '') {
            const formattedLine = currentLine.replace(/:/, ': \\\\ \\\\');
            mergedLines.push(formattedLine);
        }

        return mergedLines;
    }
    public fullUnpack(xml: any, desiredAction: DesiredAction) {
        return this.createLineArrayFromLatex(this.xmlFullMLToLatex(this.extractFullMLSolution(this.xmlToObjectMathML(xml), desiredAction)));
    }
}
