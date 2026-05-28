import { resolve, basename } from "node:path";
import { isNone } from "ts-utility-kit/option";
import { createErr, type Result, type Unit } from "ts-utility-kit/result";
import type { TechMaterial } from "../core/core-static";
import { typescriptTemplateInstall } from "../common/typescript-template-install";

export async function reactInstaller({
    appPath,
    material
}: {
    appPath: string;
    material: TechMaterial;
}): Promise<Result<Unit, Error>> {
    const { styleSheet } = material;

    const root = resolve(appPath);
    const appName = basename(appPath);

    if (isNone(styleSheet)) {
        return createErr(new Error("CSS option is required"));
    }

    return await typescriptTemplateInstall({
        root,
        appName,
        material
    });
}
