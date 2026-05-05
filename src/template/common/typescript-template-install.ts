import type { TechMaterial } from "../core/core-static";
import fs from "fs/promises";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { isFolderEmpty } from "@/helper/is-folder-empty";
import { copy } from "@/helper/copy";
import { green } from "picocolors";
import { type Unit, type Result, resultUtility } from "ts-shared";

export async function typescriptTemplateInstall({
    root,
    appName,
    material
}: {
    root: string;
    appName: string;
    material: TechMaterial;
}): Promise<Result<Unit, Error>> {
    const { UNIT, createNg, createOk, checkPromiseVoid } = resultUtility;
    const { path: templatePath } = material;

    const copySource = ["**/*"];

    mkdirSync(root, { recursive: true });

    if (!isFolderEmpty(root, appName)) {
        return createNg(
            new Error(
                `The directory ${appName} is not empty. Please choose a different project name or remove the existing directory.\n`
            )
        );
    }

    console.log(`Creating a new React app in ${green(root)}.`);
    console.log();

    process.chdir(root);

    const res = await copy(copySource, root, {
        parents: true,
        cwd: templatePath,
        rename: (name) => {
            switch (name) {
                case "gitignore":
                    return `.${name}`;
                case "env":
                    return `.${name}`;
                case "package-template.json":
                    return "package.json";
                case "README.sample.md":
                    return "README.md";
                default:
                    return name;
            }
        }
    });

    if (res.isErr) {
        return res;
    }

    const pkgPath = path.join(root, "package.json");

    const exists = await checkPromiseVoid({
        fn: async () => {
            await fs.stat(pkgPath);
        },
        err: (e) => {
            if (e instanceof Error) {
                return createNg(
                    new Error(`Failed to access package.json: ${e.message}`)
                );
            }
            return createNg(
                new Error("Failed to access package.json: Unknown error")
            );
        }
    });

    if (exists.isErr) {
        return exists;
    }

    const raw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(raw || "{}");

    if (!appName || typeof appName !== "string") {
        return createNg(new Error("Invalid app name"));
    }

    pkg.name = appName;
    pkg.version = "0.1.0";

    const writeResult = await checkPromiseVoid({
        fn: async () => {
            await fs.writeFile(
                pkgPath,
                JSON.stringify(pkg, null, 2) + "\n",
                "utf8"
            );
        },
        err: () => createNg(new Error(`Failed to update package.json name`))
    });

    if (writeResult.isErr) {
        return writeResult;
    }

    return createOk(UNIT);
}
