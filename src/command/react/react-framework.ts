import prompts from "prompts";
import { onPromptState } from "../common/command-core";
import { isReactFramework } from "./react-is";
import { type Option, resultUtility } from "ts-shared";

export async function frameworkCommand(optionFramework: Option<unknown>) {
    const { createNg, createOk, checkPromiseReturn } = resultUtility;
    if (optionFramework.isSome && isReactFramework(optionFramework.value)) {
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
                return createNg(new Error(`Prompt failed: ${e.message}`));
            }
            return createNg(new Error("Prompt failed: Unknown error"));
        }
    });

    if (response.isErr) {
        return response;
    }

    const framework = response.value.framework;

    if (isReactFramework(framework)) {
        return createOk(framework);
    }

    return createNg(new Error("Framework selection is invalid"));
}
