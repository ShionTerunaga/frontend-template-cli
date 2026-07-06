import { isSome, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr,
    type Result
} from "ts-utility-kit/result";
import { isVueFramework } from "@/template/vue/vue-is";
import type { VueFramework } from "@/template/vue/vue-static";
import { select } from "@clack/prompts";
import { onPromptCancel } from "../common/command-core";

export async function vueFrameworkCommand(
    optionVueFramework: Option<unknown>
): Promise<Result<VueFramework, Error>> {
    if (
        isSome(optionVueFramework) &&
        isVueFramework(optionVueFramework.value)
    ) {
        return createOk(optionVueFramework.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await select({
                message: `Select a framework for your project:`,
                options: [
                    { label: "Vue router", value: "vue-router" },
                    { label: "Nuxt.js", value: "nuxt" }
                ],
                initialValue: "vue-router"
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

    const framework = response.value;

    if (isVueFramework(framework)) {
        return createOk(framework);
    }

    return createErr(new Error("Framework selection is invalid"));
}
