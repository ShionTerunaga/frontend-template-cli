import prompts from "prompts";
import { onPromptState } from "../common/command-core";
import { isReactFramework } from "./react-is";
import { isSome, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr
} from "ts-utility-kit/result";

export async function frameworkCommand(optionFramework: Option<unknown>) {
    if (isSome(optionFramework) && isReactFramework(optionFramework.value)) {
        return createOk(optionFramework.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "select",
                name: "framework",
                message: `Select a framework for your project:`,
                choices: [
                    { title: "TanStack Router", value: "tanstack-router" },
                    { title: "Next.js (App Router)", value: "next/app" },
                    { title: "Next.js (Pages Router)", value: "next/pages" }
                ],
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

    const framework = response.value.framework;

    if (isReactFramework(framework)) {
        return createOk(framework);
    }

    return createErr(new Error("Framework selection is invalid"));
}
