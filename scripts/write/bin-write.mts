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
    await fs.promises.copyFile(sourcePackageJson, targetPackageJson);
}

binWrite();
