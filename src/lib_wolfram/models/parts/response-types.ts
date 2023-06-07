type StringProperties<T extends string> = {
    [key in T]: string;
};

export type QueryResultAttributes = StringProperties<
    'success' |
    'error' |
    'xml:spaces' |
    'numpods' |
    'datatypes' |
    'timing' |
    'parsetiming' |
    'id' |
    'host' |
    'server' |
    'related' |
    'version' |
    'inputstring'
> & {
    timedout?: string;
    timedoutpods?: string;
    recalculate?: string;
};

export type PodAtttributes = StringProperties<
    'title' |
    'scanner' |
    'id' |
    'position' |
    'error' |
    'numsubpods'
> & {
    primary?: string
};

export type ImgAttributes = StringProperties<
    'src' |
    'alt' |
    'title' |
    'width' |
    'height' |
    'type' |
    'themes' |
    'colorinvertable' |
    'contenttype'
>;

export type SubPod = {
    $: { title?: string };
    img: { $: ImgAttributes }[];
    plaintext: string[];
};

export type States = {
    $: { count: string };
    state: { $: { name: string }; input: string };
};

export type Pod = {
    $: PodAtttributes;
    subpod: SubPod[];
    expressiontypes: { $: { count: string }; expressiontype: { $: { name: string } } }[];
    states?: States[];
};

export type QueryResult = {
    $: QueryResultAttributes;
    pod: Pod[];
};

export type WolframResponseObject = {
    queryresult: QueryResult;
};
