import { type Option, optionUtility } from "../../utils/option";
import { resultUtility } from "../../utils/result";
import type { Choice, Falsy, PrevCaller } from "prompts";
import prompts from "prompts";
import { commanderCore } from "../common/command-core";

export async function cssCommand<T>({
    optionCss,
    isCss,
    csses
}: {
    optionCss: Option<unknown>;
    isCss: (value: unknown) => value is NonNullable<T>;
    csses: Choice[] | PrevCaller<string, Falsy | Choice[]>;
}) {
    const { optionConversion } = optionUtility;
    const { createOk, createNg, checkPromiseReturn } = resultUtility;
    const { onPromptState } = await commanderCore;

    if (optionCss.isSome && isCss(optionCss.value)) {
        return createOk(optionCss.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await prompts({
                onState: onPromptState,
                type: "select",
                name: "css",
                message: "Select a CSS framework for your project:",
                choices: csses,
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

    const css = optionConversion(response.value.css);

    if (css.isSome && isCss(css.value)) {
        return createOk(css.value);
    }

    return createNg(new Error("CSS selection is invalid"));
}
