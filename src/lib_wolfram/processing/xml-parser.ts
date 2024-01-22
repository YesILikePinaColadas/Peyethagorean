import { parseString } from "xml2js";
import { WolframMathMLResponseObject, WolframPlainResponseObject } from "../models/parts/response-types.js";
import { isDefined, isObject } from "../../utils.js";
import { DesiredAction } from "../models/parts/desired-action-types.js";
import { MathMLToLaTeX } from 'mathml-to-latex';
import * as cheerio from 'cheerio';

export type ReturnObject = {
    latexText: string[];
    countArray: number[];
}

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
    public extractFullMLSolution(desiredAction: DesiredAction, xmlMlResponse: string): string {
        let $: cheerio.CheerioAPI;
        let mathmlContent: string | null;
        switch (desiredAction) {
            case "min":
                $ = cheerio.load(xmlMlResponse, { xmlMode: true });
                mathmlContent = $('pod[title="Global minima"] subpod[title="Possible intermediate steps"] mathml').html();
                if (isDefined(mathmlContent)) {
                    return mathmlContent;
                } else {
                    throw new Error("No Possible intermediate steps Pod.")
                };
            case "integrate":
                $ = cheerio.load(xmlMlResponse, { xmlMode: true });
                mathmlContent = $('pod[title="Indefinite integrals"] subpod[title="Possible intermediate steps"] mathml').html();
                if (isDefined(mathmlContent)) {
                    return mathmlContent;
                } else {
                    throw new Error("No Possible intermediate steps Pod.")
                };
            case "solve":
            case "partial+fractions+":
                $ = cheerio.load(xmlMlResponse, { xmlMode: true });
                mathmlContent = $('pod[title="Results"] subpod[title="Possible intermediate steps"] mathml').html();
                if (isDefined(mathmlContent)) {
                    return mathmlContent;
                } else {
                    throw new Error("No Possible intermediate steps Pod.")
                };
        };
    };
    private xmlFullMLToLatex(mathMlResponse: string): string {
        const latexConversion = MathMLToLaTeX.convert(mathMlResponse);
        console.log(latexConversion)
        return latexConversion;
    };
    private processText(inputString: string, index: number, plainSolutionArray: string[]): string {
        const textPattern = /\\text\{(.*?)\}/g;

        const matches = inputString.match(textPattern);

        // console.log(matches)

        if (!matches) {
            // If no match, return the original string
            return inputString;
        }

        let counter = 0;

        matches.forEach(match => {
            if (counter === 0) {
                inputString = inputString.replace(match, `\\text{${plainSolutionArray[index]}}`);
                counter++;
            } else {
                inputString = inputString.replace(match, "");
            }
        });

        const secondPattern = /\\text\{(.*?)\}.*?\\/;

        const secondMatch = inputString.match(secondPattern);

        if (!secondMatch) {
            return inputString;
        }

        // console.log(secondMatch);

        inputString = inputString.replace(secondMatch[0], `\\text{${plainSolutionArray[index]}} \\`);

        // console.log(inputString);

        return inputString;

    }
    // private processLeftRight(inputString: string): string {
    //     // Define the main pattern
    //     const mainPattern = /\\left\(\\right\.\s*(\D*?)\\left\.\\right\) .*?(?=[\\}])/;
    //     const secondPattern = /\\left\(\\right\.\s*(\D*?)\\left\.\\right\)/;

    //     // Perform the first regex test
    //     const firstMatch = inputString.match(mainPattern);

    //     if (!firstMatch) {
    //         // If no match, return the original string
    //         // console.log("Original string of this call will be returned", inputString);
    //         return inputString;
    //     }

    //     // console.log(firstMatch)

    //     // Divide the string into two parts
    //     const firstPartMatch = firstMatch[0].match(secondPattern);

    //     if (!firstPartMatch) {
    //         // console.log("There was no second pattern match", inputString);
    //         return inputString;
    //     }

    //     const firstPart = firstMatch[0].substring(firstPartMatch[0].length);

    //     // console.log(firstPart);

    //     // Create the new string
    //     const newString = `\\left(\\right ${firstPart} \\left.\\right)`;

    //     // Concatenate the parts to get the final result
    //     const result = inputString.replace(firstMatch[0], newString);

    //     // console.log("final result of processing before calling again", result);

    //     return this.processLeftRight(result);
    // }

    public createLineArrayFromLatex(inputString: string): ReturnObject {
        // Regex to match for counting characters:

        const countTextRegex = /\\begin{matrix}(.*?)\\\\/;
        let countArray: number[] = [];

        // Replace the "invisible times" character with nothing
        const stringWithVisibleTimes = inputString.replace(/\u2062/g, '');

        // Replace weird space with regular space
        const stringWithNormalSpaces = stringWithVisibleTimes.replace(/\u2060/g, " ");

        // Split the input string into an array of lines using double backslashes
        const lines = stringWithNormalSpaces.split(/(?<!&.{0,4})\\\\(?!.{0,4}&|\\begin\{matrix\}.{0,3}\s|.{0,18}\s.{0,3}\\end\{matrix\})/);

        // console.log(lines);

        // Remove empty lines and trim leading/trailing whitespace from each line
        const cleanedLines = lines
            .filter((line) => line.trim() !== '')
            .map((line) => line.trim());

        // Merge lines until the balance of \begin{matrix} and \end{matrix} is achieved
        const mergedLines: string[] = [];
        let currentLine = '';
        let matrixBalance = 0;
        let lineCount = 0;

        cleanedLines.forEach(line => {
            currentLine += ' ' + line;
            lineCount++;

            // FOR NOW WE DECIDED TO NO LONGER DO THIS FOR STYLISTIC REASONS
            // Remove "\\text{ }=\\text{ }" and "\text{ }" pattern
            // currentLine = currentLine.replace("\\text{ }=\\text{ }", " = ");
            // currentLine = currentLine.replace("\\text{ }", "");

            const beginMatrixCount = (currentLine.match(/\\begin{matrix}/g) || []).length;
            const endMatrixCount = (currentLine.match(/\\end{matrix}/g) || []).length;

            matrixBalance = beginMatrixCount - endMatrixCount;

            // currentLine = this.processLeftRight(currentLine) as string;

            // Case of more than one equation that was bugging
            if (lineCount >= 2) {
                currentLine += ' \\\\';
            }

            // Ensuring balance in a single line is correct
            if (matrixBalance === 0) {
                // Adding double spaces
                const doubleSeparatedLine = currentLine.replace(/:/, ': \\\\ \\\\');
                // Fixing intergals 
                const integralFixedLines = doubleSeparatedLine.replace(/(\s)\\int(\s)/g, '$1\\int_$2');
                // Fixinf strings that are too long because of Then statements
                const thenFixedLines: string = integralFixedLines.replace(/\.\\text\{ Then \} /g, '.\\\\ \\text{ Then } ');
                mergedLines.push(thenFixedLines.trim());

                let thenPresent: boolean = false;
                // Dividing size in 2 in case of cutting for Then
                if (integralFixedLines !== thenFixedLines) {
                    thenPresent = true;
                }

                // Counting text
                // console.log(doubleSeparatedLine);
                const textMatch = doubleSeparatedLine.match(countTextRegex);
                if (textMatch && textMatch[1]) {
                    const textToCount = textMatch[1];
                    if (textToCount === "\\text{Therefore}: " || textToCount === "\\text{Which is equal to}: ") {
                        countArray.push(Math.round(textToCount.length * 4.5));
                        console.log("Found text and counted length, but double cause it was therefore", textToCount, `length:${textToCount.length}`);
                    }
                    else if (textToCount === "\\text{Multiply both sides by } \\left(\\right. x - 2 \\left.\\right)  \\left(\\right. x + 2 \\left.\\right) \\text{ and simplify}: " ||
                        textToCount === "\\text{Multiply numerator and denominator of } sec  \\left(\\right. u \\left.\\right) \\text{ by } tan  \\left(\\right. u \\left.\\right) + sec  \\left(\\right. u \\left.\\right)   : ") {
                        countArray.push(textToCount.length - 40);
                        console.log("Found text and counted length, but double cause it was therefore", textToCount, `length:${textToCount.length}`);
                    }
                    else if (textToCount === "\\text{Expand and collect in terms of powers of } x : ") {
                        countArray.push(textToCount.length + 30);
                        console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                    }
                    else if (textToCount === "\\text{The partial fraction expansion is of the form}: ") {
                        countArray.push(textToCount.length + 10);
                        console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                    }
                    else if (
                        textToCount === "\\text{Use the reduction formula},\\text{ } \\int \\left(sec\\right)^{m} \\left(\\right. u \\left.\\right)  d  u \\text{ }=\\text{ } \\frac{sin  \\left(\\right. u \\left.\\right)  \\left(sec\\right)^{m - 1} \\left(\\right. u \\left.\\right)}{m - 1} \\text{ }+\\text{ } \\frac{m - 2}{m - 1} \\int \\left(sec\\right)^{- 2 + m} \\left(\\right. u \\left.\\right)  d  u ,\\text{ where } m \\textrm{ }\\text{ }=\\text{ } 3 : " ||
                        textToCount === "\\text{For the integrand } \\frac{\\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) + sec  \\left(\\right. u \\left.\\right)  tan  \\left(\\right. u \\left.\\right)}{sec  \\left(\\right. u \\left.\\right) + tan  \\left(\\right. u \\left.\\right)} ,\\text{ substitute } s \\textrm{ }\\text{ }=\\text{ } tan  \\left(\\right. u \\left.\\right) + sec  \\left(\\right. u \\left.\\right) \\text{ and } d  s \\textrm{ }\\text{ }=\\text{ } \\left(\\right. \\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) + tan  \\left(\\right. u \\left.\\right)  sec  \\left(\\right. u \\left.\\right) \\left.\\right) \\textrm{ } d  u : " ||
                        textToCount === "\\text{For the integrand } \\left(tan\\right)^{2} \\left(\\right. u \\left.\\right)  sec  \\left(\\right. u \\left.\\right) ,\\text{ write } \\left(tan\\right)^{2} \\left(\\right. u \\left.\\right) \\text{ as } \\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) - 1 : " ||
                        textToCount === "\\text{Expanding the integrand } sec  \\left(\\right. u \\left.\\right)  \\left(\\right. \\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) - 1 \\left.\\right) \\text{ gives } \\left(sec\\right)^{3} \\left(\\right. u \\left.\\right) - sec  \\left(\\right. u \\left.\\right) : " ||
                        textToCount === "\\text{Multiply numerator and denominator of } \\frac{1}{1 - \\left(sin\\right)^{4} \\left(\\right. x \\left.\\right)} \\text{ by } \\left(sec\\right)^{4} \\left(\\right. x \\left.\\right)   : " ||
                        textToCount === "\\text{For the integrand } \\frac{u^{2} + 1}{2  u^{2} + 1} ,\\text{ do long division}: " ||
                        textToCount === "\\text{The integral of } \\frac{1}{s^{2} + 1} \\text{ is } \\left(tan\\right)^{- 1} \\left(\\right. s \\left.\\right) : "
                    ) {
                        countArray.push(Math.round(textToCount.length / 2));
                        console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                    }
                    else if (textToCount === "\\text{Factor the answer a different way}: ") {
                        countArray.push(textToCount.length + 15);
                        console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                    }
                    else if (textToCount === "\\text{For the integrand } \\sqrt{a^{2} + x^{2}} ,\\text{ }(\\text{assuming all variables are positive})\\text{ substitute } x \\textrm{ }\\text{ }=\\text{ } a  tan  \\left(\\right. u \\left.\\right) \\text{ and } d  x \\textrm{ }\\text{ }=\\text{ } a  \\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) \\textrm{ } d  u .\\text{ Then } \\sqrt{a^{2} + x^{2}} \\text{ }=\\text{ } \\sqrt{a^{2}  \\left(tan\\right)^{2} \\left(\\right. u \\left.\\right) + a^{2}} \\text{ }=\\text{ } a  sec  \\left(\\right. u \\left.\\right) \\text{ and } u \\textrm{ }\\text{ }=\\text{ } \\left(tan\\right)^{- 1} \\left(\\right. \\frac{x}{a} \\left.\\right) : " ||
                        textToCount === "\\text{For the integrand } \\sqrt{x^{2} - a^{2}} ,\\text{ }(\\text{assuming all variables are positive})\\text{ substitute } x \\textrm{ }\\text{ }=\\text{ } a  sec  \\left(\\right. u \\left.\\right) \\text{ and } d  x \\textrm{ }\\text{ }=\\text{ } a  tan  \\left(\\right. u \\left.\\right)  sec  \\left(\\right. u \\left.\\right) \\textrm{ } d  u .\\text{ Then } \\sqrt{x^{2} - a^{2}} \\text{ }=\\text{ } \\sqrt{a^{2}  \\left(sec\\right)^{2} \\left(\\right. u \\left.\\right) - a^{2}} \\text{ }=\\text{ } a  tan  \\left(\\right. u \\left.\\right) \\text{ and } u \\textrm{ }\\text{ }=\\text{ } \\left(sec\\right)^{- 1} \\left(\\right. \\frac{x}{a} \\left.\\right) : " ||
                        textToCount === "\\text{Prepare to substitute } u \\textrm{ }\\text{ }=\\text{ } tan  \\left(\\right. x \\left.\\right) .\\text{ Rewrite } \\frac{\\left(sec\\right)^{4} \\left(\\right. x \\left.\\right)}{\\left(sec\\right)^{4} \\left(\\right. x \\left.\\right) - \\left(tan\\right)^{4} \\left(\\right. x \\left.\\right)} \\text{ using } \\left(sec\\right)^{2} \\left(\\right. x \\left.\\right) \\textrm{ }\\text{ }=\\text{ } \\left(tan\\right)^{2} \\left(\\right. x \\left.\\right) + 1   : " ||
                        textToCount === "\\text{For the integrand } \\frac{\\left(\\right. 1 + \\left(tan\\right)^{2} \\left(\\right. x \\left.\\right) \\left.\\right)  \\left(sec\\right)^{2} \\left(\\right. x \\left.\\right)}{1 + 2  \\left(tan\\right)^{2} \\left(\\right. x \\left.\\right)} ,\\text{ substitute } u \\textrm{ }\\text{ }=\\text{ } tan  \\left(\\right. x \\left.\\right) \\text{ and } d  u \\textrm{ }\\text{ }=\\text{ } \\left(sec\\right)^{2} \\left(\\right. x \\left.\\right) \\textrm{ } d  x : ") {
                        countArray.push(Math.round(textToCount.length / 3));
                        console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                    }
                    else {
                        if (thenPresent) {
                            countArray.push(Math.round(textToCount.length / 2));
                            console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                        } else {
                            countArray.push(textToCount.length);
                            console.log("Found text and counted length", textToCount, `length:${textToCount.length}`);
                        }
                    }
                } else {
                    countArray.push(currentLine.length);
                    console.log("Text not found so counted everything", `length:${currentLine.length}`);
                }
                console.log("Pushed line", currentLine);
                currentLine = '';
                lineCount = 0;
            }
        });

        const returnObject = {
            latexText: mergedLines,
            countArray: countArray,
        };
        return returnObject;
    }
    // private plainUnpack(xml: string, desiredAction: DesiredAction): string {
    //     return this.extractFullSolution(this.xmlToObjectPlain(xml), desiredAction)
    // }
    public fullMlUnpack(xmlMathml: string, desiredAction: DesiredAction): ReturnObject {
        return this.createLineArrayFromLatex(this.xmlFullMLToLatex(this.extractFullMLSolution(desiredAction, xmlMathml)));
    }
}
