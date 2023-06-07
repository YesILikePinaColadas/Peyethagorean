export type TargetRequired<T extends object, K extends keyof T> = Omit<T, K> & {
    [key in K]-?: NonNullable<T[key]>;
};

// This type wasn't even used anywhere, maybe I should not care much.
// This syntax was not easy for me to read the first time
// type TargetRequired has generic type T (which extends object), and K (which extends to the keys of T).
// -? in the mapped type means all must be present in the case of a type that has optional element.
// P (key) inside the bracket represents a property of the type T. 
// The type TargetRequired takes object T, and one key K. It then REMOVES the property K and turns all other into mandatory properties.
// A better way to explain may be saying that it removes non mandatory properties.

// A few tests below:

export type TargetRequiredTest1<T extends object, K extends keyof T> = Omit<T, K>;

type TestObject = { shit: string, ok: number, baddie: boolean };

const shit1 = "kay";
const rand1 = 3;

const ok: TargetRequiredTest1<TestObject, "shit"> = { ok: 2, baddie: true }; // ok and baddie are mandatory, and shit must not be
const ok2: TargetRequiredTest1<TestObject, "ok"> = { shit: "stringing", baddie: false };
const ok3: TargetRequiredTest1<TestObject, "baddie"> = { shit: "stringing", ok: 2 };

export type TargetPartial<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Partial makes everything become optional
// Pick constructs a type by picking keys of another type.

// A few tests below:

const partialTest1: TargetPartial<TestObject, "shit"> = { baddie: false, ok: 3 }; //shit became optional
const partialTest2: TargetPartial<TestObject, "baddie"> = { shit: "ok", ok: 4, baddie: false }; //baddie became optional
const partialTest３: TargetPartial<TestObject, "baddie" | "shit" | "ok"> = {}; //everything became optional

export type WithoutUnion<T, U> = T extends U ? never : T;

// T is convention for type, K for key, V for value, and D for Data/Default. U is used as the next type (alphabeticaly makes sense).
// never is a type used to indicate something that will not happen. 
// If T extends U, then it is a never type, otherwise it is just T.
// It was used to filter out union types. That is, you can give it a type in T that is composed of A, B, C
// However, only A extends U. The resulting type will then be B, C. Example below:

type B = {
    name: string
};
type C = {
    nombre: string
};
type A = {
    nome: string
};
type AB = {
    nome: string,
    name: string
}

const withoutTest1: WithoutUnion<A | B | C, { name: string }> = { nome: "fabiano" }; // Has type A | C.

const withoutTest2: WithoutUnion<AB | C, A | B> = { nombre: "fabiano" };// AB extends both A and B, so it became C.

export type WithoutErrors<T> = Omit<T, "errors">;