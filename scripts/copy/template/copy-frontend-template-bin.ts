import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

function copyDir(src: string, dest: string) {
    const stat = fs.statSync(src);

    if (!stat.isDirectory()) {
        throw new Error(`Source is not a directory: ${src}`);
    }

    fs.mkdirSync(dest, { recursive: true });

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
            continue;
        }

        if (entry.isSymbolicLink()) {
            const target = fs.readlinkSync(srcPath);

            try {
                fs.rmSync(destPath, { force: true, recursive: true });
            } catch {}

            fs.symlinkSync(target, destPath);
            continue;
        }

        fs.copyFileSync(srcPath, destPath);
        fs.chmodSync(destPath, fs.statSync(srcPath).mode);
    }
}

function runGit(args: string[], cwd?: string) {
    execFileSync("git", args, {
        cwd,
        stdio: "inherit"
    });
}

async function main() {
    const repoRoot = path.resolve(__dirname, "..", "..", "..");
    const tempRoot = path.join(repoRoot, ".tmp", "frontend-template");
    const checkoutDir = path.join(tempRoot, "repo");
    const sourceTemplateDir = path.join(checkoutDir, "template");
    const binDir = path.join(repoRoot, "bin");
    const destTemplateDir = path.join(binDir, "template");

    fs.rmSync(tempRoot, { recursive: true, force: true });
    fs.mkdirSync(tempRoot, { recursive: true });

    try {
        console.log("Cloning frontend-template...");
        runGit([
            "clone",
            "--depth",
            "1",
            "--filter=blob:none",
            "--sparse",
            "https://github.com/ShionTerunaga/frontend-template",
            checkoutDir
        ]);

        console.log("Checking out template directory...");
        runGit(["sparse-checkout", "set", "template"], checkoutDir);

        if (!fs.existsSync(sourceTemplateDir)) {
            throw new Error(
                `template directory not found: ${sourceTemplateDir}`
            );
        }

        fs.rmSync(binDir, { recursive: true, force: true });
        fs.mkdirSync(binDir, { recursive: true });

        console.log("Copying template into bin/template...");
        copyDir(sourceTemplateDir, destTemplateDir);

        console.log(`Done: ${destTemplateDir}`);
    } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    }
}

main().catch((error) => {
    console.error("Failed to copy template into bin:", error);
    process.exit(1);
});
