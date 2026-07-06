import { select } from "@clack/prompts";
import { onPromptCancel } from "../common/command-core";
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
            await select({
                message: `Select a framework for your project:`,
                options: [
                    { label: "TanStack Router", value: "tanstack-router" },
                    { label: "Next.js (App Router)", value: "next/app" },
                    { label: "Next.js (Pages Router)", value: "next/pages" }
                ],
                initialValue: "tanstack-router"
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

    if (isReactFramework(framework)) {
        return createOk(framework);
    }

    return createErr(new Error("Framework selection is invalid"));
}
