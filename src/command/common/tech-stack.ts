import prompts from "prompts";
import { isTechStack } from "../react/react-is";
import { type Option, type Result, resultUtility } from "ts-shared";
import {
    techStackSelectList,
    type TechStack
} from "@/template/core/core-static";
import { onPromptState } from "./command-core";

export async function techStackCommand(
    optionTech: Option<unknown>
): Promise<Result<TechStack, Error>> {
    const { createOk, createNg, checkPromiseReturn } = resultUtility;

    if (optionTech.isSome && isTechStack(optionTech.value)) {
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
                return createNg(new Error(`Prompt failed: ${e.message}`));
            }
            return createNg(new Error("Prompt failed: Unknown error"));
        }
    });

    if (response.isErr) {
        return response;
    }

    const techStack = response.value.techStack;

    if (isTechStack(techStack)) {
        return createOk(techStack);
    }

    return createNg(new Error("Tech stack selection is invalid"));
}
