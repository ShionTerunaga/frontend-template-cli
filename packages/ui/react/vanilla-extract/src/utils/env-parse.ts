import { type Option, optionUtility } from "./option";

export function envParse(env: string | undefined): Option<string> {
    const { optionConversion } = optionUtility;

    return optionConversion<string>(env);
}
