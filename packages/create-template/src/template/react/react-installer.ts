import { resolve, basename } from "node:path";
import { Noop, Result, resultUtility } from "../../utils/result";
import { TechMaterial } from "../core/core-static";

import { typescriptTemplateInstall } from "../common/typescript-template-install";
import { isReactCss } from "../../command/react/react-is";

export async function reactInstaller({
    appPath,
    material
}: {
    appPath: string;
    material: TechMaterial;
}): Promise<Result<Noop, Error>> {
    const { createNg } = resultUtility;
    const { styleSheet } = material;

    const root = resolve(appPath);
    const appName = basename(appPath);

    if (styleSheet.isNone) {
        return createNg(new Error("CSS option is required"));
    }

    return await typescriptTemplateInstall({
        root,
        appName,
        material
    });
}
