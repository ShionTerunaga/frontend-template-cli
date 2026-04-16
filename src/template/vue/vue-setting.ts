import path from "path";
import { vueCssCommander } from "../../command/vue/vue-css";
import { vueFrameworkCommand } from "../../command/vue/vue-framework";
import { fileURLToPath } from "node:url";
import { type Result, resultUtility, optionUtility } from "ts-shared";
import type { TechMaterial } from "../core/core-static";
import { foundFolder } from "../../utils/found-file";
import {
    optionCss,
    optionVueFramework
} from "../../command/common/commander-option";

export async function vueCli(): Promise<Result<TechMaterial, Error>> {
    const { createSome } = optionUtility;
    const { createOk } = resultUtility;
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const frameworkResult = await vueFrameworkCommand(await optionVueFramework);

    if (frameworkResult.isErr) {
        return frameworkResult;
    }

    const cssResult = await vueCssCommander(await optionCss);

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
