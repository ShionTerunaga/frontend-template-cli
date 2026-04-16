import fs from "node:fs";
import { pathToFileURL } from "node:url";

export function getLatestVersion(changelogPath = "CHANGELOG.md") {
    const changelog = fs.readFileSync(changelogPath, "utf8");
    const match = changelog.match(/^##\s+([0-9]+\.[0-9]+\.[0-9]+)\s*$/m);

    if (!match?.[1]) {
        throw new Error("Could not find the latest version in CHANGELOG.md.");
    }

    return match[1];
}

export function getReleaseNotes(
    version: string,
    changelogPath = "CHANGELOG.md"
) {
    const changelog = fs.readFileSync(changelogPath, "utf8");
    const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionPattern = new RegExp(
        `^## ${escapedVersion}\\n([\\s\\S]*?)(?=^## |\\Z)`,
        "m"
    );
    const match = changelog.match(sectionPattern);

    if (!match) {
        throw new Error(
            `Could not find CHANGELOG entry for version ${version}.`
        );
    }

    return `## ${version}\n${match[1].trim()}\n`;
}

export function writeReleaseNotes(
    version: string,
    outputPath = "release-notes.md"
) {
    const notes = getReleaseNotes(version);
    fs.writeFileSync(outputPath, notes);
}

function main() {
    const version = process.env.VERSION ?? getLatestVersion();
    const outputPath = process.env.OUTPUT_PATH ?? "release-notes.md";

    writeReleaseNotes(version, outputPath);
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main();
}
