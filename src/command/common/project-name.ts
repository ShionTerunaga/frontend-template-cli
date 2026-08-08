import { isSome, optionConversion, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import { isString } from "@/utils/is";
import { text } from "@clack/prompts";
import { validateNpmName } from "../../helper/validate-npm-name";
import { onPromptCancel } from "./command-core";

export async function nameCommand(
    optionName: Option<unknown>
): Promise<Result<string, Error>> {
    if (isSome(optionName) && isString(optionName.value)) {
        return createOk(optionName.value.trim());
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await text({
                message: "What is your project named?",
                defaultValue: "my-project",
                validate: (name: string): string | undefined => {
                    const validation = validateNpmName(name);

                    if (validation.valid) {
                        return undefined;
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

    onPromptCancel(response.value);

    const name = optionConversion(response.value);

    if (isSome(name) && isString(name.value)) {
        return createOk(name.value.trim());
    }

    return createOk("my-project");
}
