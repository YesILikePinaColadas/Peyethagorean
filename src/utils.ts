export const isDefined = <T>(value: T | undefined | null): value is T => {
    if (value === undefined) return false;
    if (value === null) return false;
    return true;
};

export const isObject = (x: unknown): x is object => isDefined(x) && (typeof x === "object" || typeof x === "function");
export const isArray = <T>(x: unknown): x is Array<T> => isDefined(x) && Array.isArray(x);

// Using the is keyword allows to type guard for the entire block in which the function is called.

export type Input = {
    input: string;
};

export const isInput = (input: Input): input is Input => isDefined(input) && input.input.search("=") !== -1;

export function jsonReplacer(key: any, value: any) {
    if (typeof value === "object" || Array.isArray(value)) {
        return value;
    }
    return value;
}
