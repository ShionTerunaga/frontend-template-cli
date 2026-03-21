import path from "path";
import { commanderCore } from "../../command/common/command-core";
import { cssReactCommand } from "../../command/react/react-css";
import { frameworkCommand } from "../../command/react/react-framework";
import { Result, resultUtility } from "../../utils/result";
import { TechMaterial } from "../core/core-static";
import { foundFolder } from "../../utils/found-file";
import { optionUtility } from "../../utils/option";

export async function reactCli(): Promise<Result<TechMaterial, Error>> {
    const { optionReactFramework, optionCss } = commanderCore;
    const { createOk } = resultUtility;
    const { createSome } = optionUtility;

    const frameworResult = await frameworkCommand(optionReactFramework);

    if (frameworResult.isErr) {
        return frameworResult;
    }

    const cssResult = await cssReactCommand(optionCss);

    if (cssResult.isErr) {
        return cssResult;
    }

    const resultPath = foundFolder([
        path.join(
            __dirname,
            "template",
            "react",
            frameworResult.value,
            cssResult.value
        )
    ]);

    if (resultPath.isErr) {
        return resultPath;
    }

    const techMaterial: TechMaterial = {
        path: resultPath.value,
        styleSheet: createSome(cssResult.value)
    };

    return createOk(techMaterial);
}
