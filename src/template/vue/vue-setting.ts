import path from "path";
import { createSome } from "ts-utility-kit/option";
import { createOk, isErr, type Result } from "ts-utility-kit/result";
import { vueCssCommander } from "@/command/vue/vue-css";
import { vueFrameworkCommand } from "@/command/vue/vue-framework";
import { fileURLToPath } from "node:url";
import type { TechMaterial } from "../core/core-static";
import { foundFolder } from "@/utils/found-file";
import {
    optionCss,
    optionVueFramework
} from "@/command/common/commander-option";

export async function vueCli(): Promise<Result<TechMaterial, Error>> {
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const frameworkResult = await vueFrameworkCommand(await optionVueFramework);

    if (isErr(frameworkResult)) {
        return frameworkResult;
    }

    const cssResult = await vueCssCommander(await optionCss);

    if (isErr(cssResult)) {
        return cssResult;
    }

    const templatePath = [
        path.join(
            cliDir,
            "template",
            "vue",
            frameworkResult.value,
            cssResult.value
        )
    ];

    const resultPath = foundFolder(templatePath);

    if (isErr(resultPath)) {
        return resultPath;
    }

    const techMaterial: TechMaterial = {
        path: resultPath.value,
        styleSheet: createSome(cssResult.value)
    };

    return createOk(techMaterial);
}
