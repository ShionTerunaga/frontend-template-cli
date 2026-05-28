import path from "path";
import { createSome } from "ts-utility-kit/option";
import { createOk, isErr, type Result } from "ts-utility-kit/result";
import { cssReactCommand } from "@/command/react/react-css";
import { frameworkCommand } from "@/command/react/react-framework";
import { fileURLToPath } from "node:url";
import type { TechMaterial } from "../core/core-static";
import { foundFolder } from "@/utils/found-file";
import {
    optionCss,
    optionReactFramework
} from "@/command/common/commander-option";

export async function reactCli(): Promise<Result<TechMaterial, Error>> {
    const cliDir = path.dirname(fileURLToPath(import.meta.url));

    const frameworResult = await frameworkCommand(await optionReactFramework);

    if (isErr(frameworResult)) {
        return frameworResult;
    }

    const cssResult = await cssReactCommand(await optionCss);

    if (isErr(cssResult)) {
        return cssResult;
    }

    const resultPath = foundFolder([
        path.join(
            cliDir,
            "template",
            "react",
            frameworResult.value,
            cssResult.value
        )
    ]);

    if (isErr(resultPath)) {
        return resultPath;
    }

    const techMaterial: TechMaterial = {
        path: resultPath.value,
        styleSheet: createSome(cssResult.value)
    };

    return createOk(techMaterial);
}
