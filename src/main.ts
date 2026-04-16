import { basename, resolve } from "node:path";
import { validateNpmName } from "./helper/validate-npm-name";
import { existsSync } from "node:fs";
import { bold, red, green } from "picocolors";
import { nameCommand } from "./command/common/project-name";
import { cliErrorLog } from "./shared/error";
import { techStackCommand } from "./command/common/tech-stack";
import { createApp } from "./template/core/core";
import type { RunSuccess, TechStack } from "./template/core/core-static";
import { reactCallback } from "./then";
import { optionName, optionTechStack } from "./command/common/commander-option";
import { getLatestVersion } from "./helper/get-latest-version";
import { getCurrentVersion } from "./command/common/command-core";
import { continueCurrentVersionCommand } from "./command/version/continue-current-version";
import { type Result, resultUtility, type Unit } from "ts-shared";

const handleSigTerm = () => process.exit(0);
const INSTALL_COMMAND =
    "npm i -g github:ShionTerunaga/frontend-template-cli#release";

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

export async function run(): Promise<RunSuccess> {
    await checkCliVersion();

    const projectName = await nameCommand(await optionName);

    if (projectName.isErr) {
        cliErrorLog(projectName.err);
        process.exit(1);
    }

    const appPath = resolve(projectName.value);
    const appName = basename(appPath);

    const techStack = await techStackCommand(await optionTechStack);

    if (techStack.isErr) {
        cliErrorLog(techStack.err);

        process.exit(1);
    }

    const validation = validateNpmName(appName);

    if (!validation.valid) {
        console.error(
            `Could not create a project called ${appName} because of npm naming restrictions:\n\n- ${validation.problems?.join(
                "\n- "
            )}\n`
        );
        process.exit(1);
    }

    if (existsSync(appName)) {
        console.error(
            red(
                `The directory ${appName} already exists. Please choose a different project name or remove the existing directory.\n`
            )
        );
        process.exit(1);
    }

    const installResult = await createApp({
        appPath,
        tech: techStack.value
    });

    if (installResult.isErr) {
        cliErrorLog(installResult.err);
        process.exit(1);
    }

    return {
        name: projectName.value,
        tech: techStack.value
    };
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
    const length = Math.max(latestParts.length, currentParts.length);

    for (let index = 0; index < length; index += 1) {
        const latestPart = latestParts[index] ?? 0;
        const currentPart = currentParts[index] ?? 0;

        if (latestPart > currentPart) {
            return true;
        }

        if (latestPart < currentPart) {
            return false;
        }
    }

    return false;
}

async function checkCliVersion(): Promise<Result<Unit, Error>> {
    const { UNIT, createOk } = resultUtility;
    const currentVersionResult = await getCurrentVersion();

    if (currentVersionResult.isErr) {
        return currentVersionResult;
    }

    const currentVersion = currentVersionResult.value;
    const latestVersionResult = await getLatestVersion();

    if (latestVersionResult.isErr) {
        return latestVersionResult;
    }

    const latestVersion = latestVersionResult.value;

    if (!isNewerVersion(latestVersion, currentVersion)) {
        return createOk(UNIT);
    }

    console.log(
        red(
            `A newer version of create-frontend-template is available. current: v${currentVersion}, latest: v${latestVersion}`
        )
    );

    const continueCurrentVersionResult = await continueCurrentVersionCommand();

    if (continueCurrentVersionResult.isErr) {
        cliErrorLog(continueCurrentVersionResult.err);
        process.exit(1);
    }

    if (continueCurrentVersionResult.value) {
        return createOk(UNIT);
    }

    console.log("\nInstall the latest version with the following command:\n");
    console.log(bold(`${green(INSTALL_COMMAND)}`));

    console.log();
    process.exit(0);
}

function techInstallInfo(techStack: TechStack) {
    switch (techStack) {
        case "react": {
            reactCallback();
        }
    }
}

export function notify(projectMaterial: RunSuccess): void {
    console.log("cd " + projectMaterial.name);

    techInstallInfo(projectMaterial.tech);

    console.log();

    console.log(bold(`${green("Happy hacking!")}`));

    process.exit(0);
}

export function errorExit() {
    console.error(red("The operation was cancelled."));

    process.exit(1);
}
