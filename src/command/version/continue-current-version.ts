import prompts from "prompts";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import { onPromptState } from "../common/command-core";

export async function continueCurrentVersionCommand(): Promise<
    Result<boolean, Error>
> {
    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "confirm",
                name: "shouldContinue",
                message: "Continue with the current version?",
                initial: false
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

    return createOk(response.value.shouldContinue === true);
}
