import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import core from "./core.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function upgradeWriteWin(): Promise<void> {
    const pathName = path.resolve(
        __dirname,
        "..",
        "..",
        "dist",
        "upgrade-win",
        "index.js"
    );

    await core(pathName);
}

upgradeWriteWin();
