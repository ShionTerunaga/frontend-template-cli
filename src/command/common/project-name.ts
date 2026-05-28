import { isSome, optionConversion, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import { isString } from "@/utils/is";
import prompts from "prompts";
import { validateNpmName } from "../../helper/validate-npm-name";
import { onPromptState } from "./command-core";

export async function nameCommand(
    optionName: Option<unknown>
): Promise<Result<string, Error>> {
    if (isSome(optionName) && isString(optionName.value)) {
        return createOk(optionName.value.trim());
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "text",
                name: "path",
                message: "What is your project named?",
                initial: "my-project",
                validate: (name: string): boolean | string => {
                    const validation = validateNpmName(name);

                    if (validation.valid) {
                        return true;
                    }

                    return `Invalid project name: ${validation.problems?.join(", ")}`;
                }
            }),
        err: (e) => {
            if (e instanceof Error) {
                return createErr(new Error(`Prompt failed: ${e.message}`));
            }

            return createErr(new Error("Prompt failed: Unknown error"));
        }
    });

    if (isErr(response)) {
        return response;
    }

    const name = optionConversion(response.value.path);

    if (isSome(name) && isString(name.value)) {
        return createOk(name.value.trim());
    }

    return createOk("my-project");
}
