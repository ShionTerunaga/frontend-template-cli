import { type Option, type Result, resultUtility } from "ts-shared";
import { isVueFramework } from "../../template/vue/vue-is";
import type { VueFramework } from "../../template/vue/vue-static";
import prompts from "prompts";
import { onPromptState } from "../common/command-core";

export async function vueFrameworkCommand(
    optionVueFramework: Option<unknown>
): Promise<Result<VueFramework, Error>> {
    const { createOk, checkPromiseReturn, createNg } = resultUtility;

    if (optionVueFramework.isSome && isVueFramework(optionVueFramework.value)) {
        return createOk(optionVueFramework.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "select",
                name: "framework",
                message: `Select a framework for your project:`,
                choices: [
                    { title: "Vue router", value: "vue-router" },
                    { title: "Nuxt.js", value: "nuxt" }
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

    if (isVueFramework(framework)) {
        return createOk(framework);
    }

    return createNg(new Error("Framework selection is invalid"));
}
