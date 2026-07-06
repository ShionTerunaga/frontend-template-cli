import { log } from "@clack/prompts";
import fs from "fs";

/**
 * Prepends a shebang to the target JS file (if missing) and marks it executable.
 */
export default async function core(pathName: string): Promise<void> {
    if (!fs.existsSync(pathName)) {
        console.error(`Target not found: ${pathName}`);
        process.exitCode = 2;
        return;
    }

    const content = fs.readFileSync(pathName, "utf8");

    if (content.startsWith("#!")) {
        log.message(`Shebang already present in ${pathName}`);
        return;
    }

    const shebang = "#!/usr/bin/env node\n";
    try {
        fs.writeFileSync(pathName, shebang + content, { encoding: "utf8" });

        try {
            fs.chmodSync(pathName, 0o755);
        } catch (chmodErr: unknown) {
            console.warn(`Warning: failed to chmod ${pathName}:`, chmodErr);
        }

        log.success(`Added shebang and set executable: ${pathName}`);
    } catch (err: unknown) {
        console.error(`Failed to write shebang to ${pathName}:`, err);
        process.exitCode = 1;
    }
}
