import { promises as fs } from "fs";
import path from "path";

type UiKind = "tailwind" | "vanilla-extract";

const root = path.resolve(__dirname, "..", "..", "..");

const relativeTargets = [
    ["next", "app"],
    ["next", "pages"],
    ["tanstack-router"]
] as const;

const relativeCopyPaths = [
    ["src", "components", "ui"],
    ["src", "stories", "ui"]
] as const;

async function existsDir(target: string): Promise<boolean> {
    const stat = await fs.stat(target).catch(() => null);
    return Boolean(stat?.isDirectory());
}

async function copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
            continue;
        }

        if (entry.isFile()) {
            await fs.copyFile(srcPath, destPath);
            continue;
        }

        if (entry.isSymbolicLink()) {
            const target = await fs.readlink(srcPath);
            await fs.symlink(target, destPath).catch(() => {
                throw new Error(
                    `failed to copy symbolic link: ${srcPath} -> ${destPath}`
                );
            });
        }
    }
}

async function copyPart(kind: UiKind, targetParts: readonly string[]) {
    const sourceBase = path.join(root, "packages", "ui", "react", kind);
    const destBase = path.join(
        root,
        "packages",
        "main-template",
        "react",
        ...targetParts,
        kind
    );

    if (!(await existsDir(destBase))) {
        console.log(`skip (destination not found): ${destBase}`);
        return;
    }

    for (const rel of relativeCopyPaths) {
        const src = path.join(sourceBase, ...rel);
        const dest = path.join(destBase, ...rel);

        if (!(await existsDir(src))) {
            throw new Error(`source directory not found: ${src}`);
        }

        await fs.rm(dest, { recursive: true, force: true });
        await copyDir(src, dest);

        console.log(`copied: ${src} -> ${dest}`);
    }
}

async function main() {
    for (const kind of ["tailwind", "vanilla-extract"] as const) {
        for (const target of relativeTargets) {
            await copyPart(kind, target);
        }
    }

    console.log("done: copied UI components/stories to React main templates.");
}

main().catch((error) => {
    console.error("copy failed:", error);
    process.exit(1);
});
