import { select } from "@clack/prompts";
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
import { onPromptCancel } from "./command-core";

export async function techStackCommand(
    optionTech: Option<unknown>
): Promise<Result<TechStack, Error>> {
    if (isSome(optionTech) && isTechStack(optionTech.value)) {
        return createOk(optionTech.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await select({
                message: "Select a tech stack for your project:",
                options: techStackSelectList.map((choice) => ({
                    label: choice.title,
                    value: choice.value
                })),
                initialValue: techStackSelectList[0]?.value
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

    const techStack = response.value;

    if (isTechStack(techStack)) {
        return createOk(techStack);
    }

    return createErr(new Error("Tech stack selection is invalid"));
}
