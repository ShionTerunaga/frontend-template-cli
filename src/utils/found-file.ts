import fs from "node:fs";
import { type Result, resultUtility } from "./result";

export function foundFolder(paths: Array<string>): Result<string, Error> {
    const { createNg, createOk } = resultUtility;

    for (const p of paths) {
        if (fs.existsSync(p)) {
            return createOk(p);
        }
    }

    return createNg(new Error(`Not found folder: ${paths.join(", ")}`));
}
