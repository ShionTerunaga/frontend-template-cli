import path from "path";
import { commanderCore } from "@/command/common/command-core";
import { vueCssCommander } from "@/command/vue/vue-css";
import { vueFrameworkCommand } from "@/command/vue/vue-framework";
import { fileURLToPath } from "node:url";
import { optionUtility } from "@/utils/option";
import type { Result } from "@/utils/result";
import { resultUtility } from "@/utils/result";
import type { TechMaterial } from "../core/core-static";
import { foundFolder } from "@/utils/found-file";

export async function vueCli(): Promise<Result<TechMaterial, Error>> {
    const { optionCss, optionVueFramework } = await commanderCore;
    const { createSome } = optionUtility;
    const { createOk } = resultUtility;
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const frameworkResult = await vueFrameworkCommand(optionVueFramework);

    if (frameworkResult.isErr) {
        return frameworkResult;
    }

    const cssResult = await vueCssCommander(optionCss);

    if (cssResult.isErr) {
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

    if (resultPath.isErr) {
        return resultPath;
    }

    const techMaterial: TechMaterial = {
        path: resultPath.value,
        styleSheet: createSome(cssResult.value)
    };

    return createOk(techMaterial);
}
