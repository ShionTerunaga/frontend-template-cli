import prompts from "prompts";
import type { TechStack } from "@/template/core/core-static";
import { techStackSelectList } from "@/template/core/core-static";
import { type Option } from "@/utils/option";
import type { Result } from "@/utils/result";
import { resultUtility } from "@/utils/result";
import { commanderCore } from "./command-core";
import { isTechStack } from "../react/react-is";

export async function techStackCommand(
    optionTech: Option<unknown>
): Promise<Result<TechStack, Error>> {
    const { createOk, createNg, checkPromiseReturn } = resultUtility;
    const { onPromptState } = await commanderCore;

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
                return new Error(`Prompt failed: ${e.message}`);
            }
            return new Error("Prompt failed: Unknown error");
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
