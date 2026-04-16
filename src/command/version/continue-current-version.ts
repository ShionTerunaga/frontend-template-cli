import prompts from "prompts";
import { type Result, resultUtility } from "ts-shared";
import { onPromptState } from "../common/command-core";

export async function continueCurrentVersionCommand(): Promise<
    Result<boolean, Error>
> {
    const { createNg, createOk, checkPromiseReturn } = resultUtility;

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
                return createNg(new Error(`Prompt failed: ${e.message}`));
            }

            return createNg(new Error("Prompt failed: Unknown error"));
        }
    });

    if (response.isErr) {
        return response;
    }

    return createOk(response.value.shouldContinue === true);
}
