import prompts from "prompts";
import { isTechStack } from "../react/react-is";
import { isSome, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import {
    techStackSelectList,
    type TechStack
} from "@/template/core/core-static";
import { onPromptState } from "./command-core";

export async function techStackCommand(
    optionTech: Option<unknown>
): Promise<Result<TechStack, Error>> {
    if (isSome(optionTech) && isTechStack(optionTech.value)) {
        return createOk(optionTech.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "select",
                name: "techStack",
                message: "Select a tech stack for your project:",
                choices: techStackSelectList,
                initial: 0
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

    const techStack = response.value.techStack;

    if (isTechStack(techStack)) {
        return createOk(techStack);
    }

    return createErr(new Error("Tech stack selection is invalid"));
}
