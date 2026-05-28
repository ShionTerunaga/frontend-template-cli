import type { Choice, Falsy, PrevCaller } from "prompts";
import prompts from "prompts";
import { isSome, optionConversion, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr
} from "ts-utility-kit/result";
import { onPromptState } from "../common/command-core";

export async function cssCommand<T>({
    optionCss,
    isCss,
    csses
}: {
    optionCss: Option<unknown>;
    isCss: (value: unknown) => value is NonNullable<T>;
    csses: Choice[] | PrevCaller<string, Falsy | Choice[]>;
}) {
    if (isSome(optionCss) && isCss(optionCss.value)) {
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
                return createErr(new Error(`Prompt failed: ${e.message}`));
            }
            return createErr(new Error("Prompt failed: Unknown error"));
        }
    });

    if (isErr(response)) {
        return response;
    }

    const css = optionConversion(response.value.css);

    if (isSome(css) && isCss(css.value)) {
        return createOk(css.value);
    }

    return createErr(new Error("CSS selection is invalid"));
}
