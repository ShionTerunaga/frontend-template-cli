import fs from "node:fs";
import { createErr, createOk, type Result } from "ts-utility-kit/result";

export function foundFolder(paths: Array<string>): Result<string, Error> {
    for (const p of paths) {
        if (fs.existsSync(p)) {
            return createOk(p);
        }
    }

    return createErr(new Error(`Not found folder: ${paths.join(", ")}`));
}
