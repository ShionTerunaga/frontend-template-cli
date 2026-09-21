import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { confirm, isCancel, log } from "@clack/prompts";
import { bold, green, red } from "picocolors";
import { techStackCommand } from "@/command/common/tech-stack";
import { getLatestVersion } from "@/helper/get-latest-version";
import { runTemplateCli } from "@/run-template-cli";

const INSTALL_COMMAND =
    "npm i -g github:ShionTerunaga/frontend-template-cli#release";

export async function run(): Promise<void> {
    const currentVersion = await getCurrentVersion();
    await checkCliVersion(currentVersion);

    const techStack = await techStackCommand(currentVersion);
    await runTemplateCli(techStack);
}

async function getCurrentVersion(): Promise<string> {
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const versionJsonPath = path.join(cliDir, "version.json");
    const versionJson = JSON.parse(await readFile(versionJsonPath, "utf8")) as {
        version?: unknown;
    };

    if (typeof versionJson.version !== "string") {
        throw new Error("version is not found in version.json");
    }

    return versionJson.version;
}

function normalizeVersion(version: string): number[] {
    return version
        .trim()
        .replace(/^v/, "")
        .split(".")
        .map((part) => Number.parseInt(part, 10) || 0);
}

function isNewerVersion(
    latestVersion: string,
    currentVersion: string
): boolean {
    const latestParts = normalizeVersion(latestVersion);
    const currentParts = normalizeVersion(currentVersion);

    if (latestParts.length !== 3 || currentParts.length !== 3) {
        throw new Error(
            `Invalid version format. Expected format is "x.y.z". latestVersion: ${latestVersion}, currentVersion: ${currentVersion}`
        );
    }

    for (let index = 0; index < latestParts.length; index++) {
        const latestPart = latestParts[index] ?? 0;
        const currentPart = currentParts[index] ?? 0;

        if (latestPart !== currentPart) {
            return latestPart > currentPart;
        }
    }

    return false;
}

async function checkCliVersion(currentVersion: string): Promise<void> {
    const latestVersion = await getLatestVersion();

    if (!isNewerVersion(latestVersion, currentVersion)) {
        return;
    }

    log.warn(
        red(
            `A newer version of create-frontend-template is available. current: v${currentVersion}, latest: v${latestVersion}`
        )
    );

    const shouldContinue = await confirm({
        message: "Continue with the current version?",
        initialValue: false
    });

    if (isCancel(shouldContinue)) {
        process.exit(1);
    }

    if (shouldContinue) {
        return;
    }

    log.message(
        `Install the latest version with the following command:\n\n${bold(green(INSTALL_COMMAND))}`
    );
    process.exit(0);
}
