import path from "path";
import { commanderCore } from "../../command/common/command-core";
import { vueCssCommander } from "../../command/vue/vue-css";
import { vueFrameworkCommand } from "../../command/vue/vue-framework";
import { optionUtility } from "../../utils/option";
import { Result, resultUtility } from "../../utils/result";
import { TechMaterial } from "../core/core-static";
import { foundFolder } from "../../utils/found-file";

export async function vueCli(): Promise<Result<TechMaterial, Error>> {
    const { optionCss, optionVueFramework } = commanderCore;
    const { createSome } = optionUtility;
    const { createOk } = resultUtility;
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
            __dirname,
            "template",
            "vue",
            frameworkResult.value,
            cssResult.value
        ),
        path.join(
            __dirname,
            "..",
            "..",
            "..",
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
