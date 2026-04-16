import { type Option, optionUtility } from "ts-shared";
import { commanderCore } from "./command-core";

async function optionCommand(opt: unknown): Promise<Option<unknown>> {
    const { optionConversion } = optionUtility;

    return optionConversion(opt);
}

export const optionName: Promise<Option<unknown>> = (async function () {
    const program = await commanderCore;

    return await optionCommand(program.opts().name);
})();

export const optionReactFramework: Promise<Option<unknown>> =
    (async function () {
        const program = await commanderCore;

        return await optionCommand(program.opts().reactFramework);
    })();

export const optionVueFramework: Promise<Option<unknown>> = (async function () {
    const program = await commanderCore;

    return await optionCommand(program.opts().vueFramework);
})();

export const optionTechStack: Promise<Option<unknown>> = (async function () {
    const program = await commanderCore;

    return await optionCommand(program.opts().techStack);
})();

export const optionCss: Promise<Option<unknown>> = (async function () {
    const program = await commanderCore;

    const css = program.opts().css;

    return await optionCommand(css);
})();

export const optionUseAllComponents: Promise<Option<unknown>> =
    (async function () {
        const program = await commanderCore;

        return await optionCommand(program.opts().useAllComponents);
    })();
