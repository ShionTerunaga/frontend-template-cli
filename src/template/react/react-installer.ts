import { resolve, basename } from "node:path";
import { type Result, resultUtility, type Unit } from "ts-shared";
import type { TechMaterial } from "../core/core-static";

import { typescriptTemplateInstall } from "../common/typescript-template-install";

export async function reactInstaller({
    appPath,
    material
}: {
    appPath: string;
    material: TechMaterial;
}): Promise<Result<Unit, Error>> {
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
