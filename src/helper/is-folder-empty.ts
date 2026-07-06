import { lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { green, blue } from "picocolors";
import { log } from "@clack/prompts";

export function isFolderEmpty(root: string, name: string): boolean {
    const validFiles = [
        ".DS_Store",
        ".git",
        ".gitattributes",
        ".gitignore",
        ".gitlab-ci.yml",
        ".hg",
        ".hgcheck",
        ".hgignore",
        ".idea",
        ".npmignore",
        ".travis.yml",
        "LICENSE",
        "Thumbs.db",
        "docs",
        "mkdocs.yml",
        "npm-debug.log",
        "yarn-debug.log",
        "yarn-error.log",
        "yarnrc.yml",
        ".yarn"
    ];

    const conflicts: Array<string> = readdirSync(root).filter((file) => {
        return !validFiles.includes(file) && !/\.iml&/.test(file);
    });

    if (conflicts.length > 0) {
        log.message(
            `The directory ${green(name)} contains files that could conflict:`
        );

        for (const file of conflicts) {
            try {
                const stats = lstatSync(join(root, file));

                if (stats.isDirectory()) {
                    log.message(blue(`  ${file}/`));
                } else {
                    log.message(`  ${file}`);
                }
            } catch {
                log.message(`  ${file}`);
            }
        }

        log.message(
            "Either try using a new directory name, or remove the files listed above."
        );
        return false;
    }

    return true;
}
