import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import core from "./core.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function upgradeWriteMac(): Promise<void> {
    const pathName = path.resolve(
        __dirname,
        "..",
        "..",
        "dist",
        "upgrade-mac",
        "index.js"
    );

    await core(pathName);
}

upgradeWriteMac();
