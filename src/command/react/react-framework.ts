import { type Option } from "../../utils/option";
import { resultUtility } from "../../utils/result";
import prompts from "prompts";
import { commanderCore } from "../common/command-core";
import { isReactFramework } from "./react-is";

export async function frameworkCommand(optionFramework: Option<unknown>) {
    const { createNg, createOk, checkPromiseReturn } = resultUtility;
    const { onPromptState } = await commanderCore;

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
                return new Error(`Prompt failed: ${e.message}`);
            }
            return new Error("Prompt failed: Unknown error");
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
