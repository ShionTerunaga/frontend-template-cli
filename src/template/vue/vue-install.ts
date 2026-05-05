import { basename, resolve } from "node:path";
import { type Unit, type Result, resultUtility } from "ts-shared";
import type { TechMaterial } from "../core/core-static";
import { typescriptTemplateInstall } from "../common/typescript-template-install";

export async function vueInstaller({
    appPath,
    material
}: {
    appPath: string;
    material: TechMaterial;
}): Promise<Result<Unit, Error>> {
    const { createNg } = resultUtility;
    const { styleSheet } = material;

    if (styleSheet.isNone) {
        return createNg(new Error("CSS option is required"));
    }

    const root = resolve(appPath);
    const appName = basename(appPath);

    const installResult = await typescriptTemplateInstall({
        root,
        appName,
        material
    });

    return installResult;
}
