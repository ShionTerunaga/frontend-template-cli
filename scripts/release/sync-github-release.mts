import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { getReleaseNotes } from "./write-release-notes.mts";

function getHeadSha(ref = "HEAD") {
    return execFileSync("git", ["rev-parse", ref], {
        encoding: "utf8"
    }).trim();
}

function releaseExists(tag: string) {
    const result = spawnSync("gh", ["release", "view", tag], {
        stdio: "ignore"
    });
    return result.status === 0;
}

function main() {
    const version = process.env.VERSION;

    if (!version) {
        throw new Error("VERSION is required.");
    }

    const tag = `v${version}`;
    const target = process.env.TARGET_SHA
        ? getHeadSha(process.env.TARGET_SHA)
        : getHeadSha();
    const notesPath = path.join(
        os.tmpdir(),
        `release-notes-${tag}-${process.pid}.md`
    );

    fs.writeFileSync(notesPath, getReleaseNotes(version));

    try {
        if (releaseExists(tag)) {
            execFileSync(
                "gh",
                [
                    "release",
                    "edit",
                    tag,
                    "--title",
                    tag,
                    "--notes-file",
                    notesPath
                ],
                {
                    stdio: "inherit"
                }
            );
            return;
        }

        execFileSync(
            "gh",
            [
                "release",
                "create",
                tag,
                "--target",
                target,
                "--title",
                tag,
                "--notes-file",
                notesPath
            ],
            {
                stdio: "inherit"
            }
        );
    } finally {
        fs.rmSync(notesPath, { force: true });
    }
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main();
}
