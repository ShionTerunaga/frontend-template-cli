import { select } from "@clack/prompts";
import { isSome, optionConversion, type Option } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    createErr,
    createOk,
    isErr
} from "ts-utility-kit/result";
import { onPromptCancel } from "../common/command-core";

export interface SelectChoice<T> {
    title: string;
    value: T;
    hint?: string;
}

export async function cssCommand<T>({
    optionCss,
    isCss,
    csses
}: {
    optionCss: Option<unknown>;
    isCss: (value: unknown) => value is NonNullable<T>;
    csses: SelectChoice<NonNullable<T>>[];
}) {
    if (isSome(optionCss) && isCss(optionCss.value)) {
        return createOk(optionCss.value);
    }

    const response = await checkPromiseReturn({
        fn: async () =>
            await select({
                message: "Select a CSS framework for your project:",
                options: csses.map((choice) => ({
                    label: choice.title,
                    value: choice.value,
                    hint: choice.hint
                })),
                initialValue: csses[0]?.value
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

    const css = optionConversion(response.value);

    if (isSome(css) && isCss(css.value)) {
        return createOk(css.value);
    }

    return createErr(new Error("CSS selection is invalid"));
}
