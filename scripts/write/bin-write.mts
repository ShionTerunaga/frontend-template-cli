import fs from "node:fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import core from "./core.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function binWrite(): Promise<void> {
    const target = path.resolve(__dirname, "..", "..", "bin", "index.mjs");
    const legacyTarget = path.resolve(__dirname, "..", "..", "bin", "index.js");
    const sourcePackageJson = path.resolve(
        __dirname,
        "..",
        "..",
        "package.json"
    );
    const targetPackageJson = path.resolve(
        __dirname,
        "..",
        "..",
        "bin",
        "package.json"
    );

    try {
        await fs.promises.rm(legacyTarget, { force: true });
    } catch {}

    await core(target);

    const sourcePackageJsonText = await fs.promises.readFile(
        sourcePackageJson,
        "utf8"
    );
    const sourcePackage = JSON.parse(sourcePackageJsonText) as {
        name: string;
        version: string;
        description?: string;
        type?: string;
        license?: string;
        engines?: Record<string, string>;
    };

    const binPackage = {
        name: sourcePackage.name,
        version: sourcePackage.version,
        description: sourcePackage.description,
        type: sourcePackage.type,
        license: sourcePackage.license,
        engines: sourcePackage.engines,
        bin: {
            [sourcePackage.name]: "./index.mjs"
        },
        files: ["index.mjs", "template"]
    };

    await fs.promises.writeFile(
        targetPackageJson,
        `${JSON.stringify(binPackage, null, 2)}\n`
    );
}

binWrite();
