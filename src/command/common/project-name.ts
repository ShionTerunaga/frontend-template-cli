import {
    resultUtility,
    type Result,
    optionUtility,
    type Option
} from "ts-shared";
import { isString } from "../../utils/is";
import prompts from "prompts";
import { validateNpmName } from "../../helper/validate-npm-name";
import { onPromptState } from "./command-core";

export async function nameCommand(
    optionName: Option<unknown>
): Promise<Result<string, Error>> {
    const { optionConversion } = optionUtility;
    const { createOk, createNg, checkPromiseReturn } = resultUtility;

    if (optionName.isSome && isString(optionName.value)) {
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
                return createNg(new Error(`Prompt failed: ${e.message}`));
            }

            return createNg(new Error("Prompt failed: Unknown error"));
        }
    });

    if (response.isErr) {
        return response;
    }

    const name = optionConversion(response.value.path);

    if (name.isSome && isString(name.value)) {
        return createOk(name.value.trim());
    }

    return createOk("my-project");
}
