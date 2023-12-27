import { isDefined } from "./utils.js";

export const systemParameterName = [
    //env
    "ENV",
    "PORT",
    "PUBLIC_IP",
    "PRIVATE_IP",

    // TEST
    "NODE_ENV",

    // LOG
    "LOG_BACKUPS",

    // WOLFRAM API,
    "WOLFRAM_URL",
    "WOLFRAM_APPID",

    // AZURE COMP V,
    "AZURE_VISION_ENDPOINT",
    "AZURE_VISION_KEY",
    "AZURE_VISION_KEY2",

] as const;

// Using as const in the end of an array declaration is a good idea for fixed arrays that will not change.
// That is because using as const in the end turns the array into a tuple, which makes it so that neither order nor elements change.

export type SystemParameterName = typeof systemParameterName[number];
export const systemEnvironments = ["test", "staging", "development", "production"] as const;
export type Environment = typeof systemEnvironments[number];

// The type number can be any number (kinda crazy to say) hence using number is a way of pulling all indexes (I guess?)

export class SystemParameter {
    private static defaultValue<V>(name: SystemParameterName, defaultValue?: V): V {
        if (!isDefined(defaultValue)) throw new Error(`${name}のenvがセットされていない。`);
        return defaultValue;
    };
    public static isDefined(name: SystemParameterName): boolean {
        return typeof SystemParameter.getString(name) === "string" && SystemParameter.getString(name) !== "";
    };
    public static getString(name: SystemParameterName, defaultValue?: string): string {
        const v = process.env[name];
        if (typeof v !== "string") return this.defaultValue(name, defaultValue);
        return v;
    };
    public static mode(): Environment {
        const env = SystemParameter.getString("NODE_ENV", SystemParameter.getString("ENV")).toLocaleLowerCase();
        switch (env) {
            case "test":
                return "test";
            case "staging":
                return "staging";
            case "development":
                return "development";
            default:
                return "production";
        };
    };
}

// static is used to define elements that are defined in the class scope, that is, regardless of instances of that class.
// Hence, using private static creates an immutable class-level defined value that cannot be accessed outside of the class
// using public static created a method that can be accessed outside of the class, but is still immutable
// This second case may be useful for some reasons (chatgpt explained well), such as calling methods from a class directly
// By directly above we mean, without creating an instance of said class. 
// I don't really understand the purpose of this class.
// It seems like a class not meant to be instatiated, but to be used to access env variables, but why not access them directly??
