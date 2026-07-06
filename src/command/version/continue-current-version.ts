import { confirm } from "@clack/prompts";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import { onPromptCancel } from "../common/command-core";

export async function continueCurrentVersionCommand(): Promise<
    Result<boolean, Error>
> {
    const response = await checkPromiseReturn({
        fn: async () =>
            await confirm({
                message: "Continue with the current version?",
                initialValue: false
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

    return createOk(response.value === true);
}
