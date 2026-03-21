import fs from "fs";

/**
 * Prepends a shebang to the target JS file (if missing) and marks it executable.
 */
async function core(pathName: string) {
    if (!fs.existsSync(pathName)) {
        console.error(`Target not found: ${pathName}`);
        process.exitCode = 2;
        return;
    }

    const content = fs.readFileSync(pathName, "utf8");

    // If file already starts with a shebang, do nothing
    if (content.startsWith("#!")) {
        console.log(`Shebang already present in ${pathName}`);
        return;
    }

    const shebang = "#!/usr/bin/env node\n";
    try {
        fs.writeFileSync(pathName, shebang + content, { encoding: "utf8" });

        // Try to set executable bit (0o755)
        try {
            fs.chmodSync(pathName, 0o755);
        } catch (chmodErr) {
            // Non-fatal: still succeed but warn the user
            console.warn(`Warning: failed to chmod ${pathName}:`, chmodErr);
        }

        console.log(`Added shebang and set executable: ${pathName}`);
    } catch (err) {
        console.error(`Failed to write shebang to ${pathName}:`, err);
        process.exitCode = 1;
    }
}

export default core;
