import { basename, resolve } from "node:path";
import { log } from "@clack/prompts";
import { validateNpmName } from "@/helper/validate-npm-name";
import { existsSync } from "node:fs";
import { bold, red, green } from "picocolors";
import { nameCommand } from "@/command/common/project-name";
import { techStackCommand } from "@/command/common/tech-stack";
import { createApp } from "@/template/core/core";
import type { RunSuccess, TechStack } from "@/template/core/core-static";

import { reactCallback, vueCallback } from "@/then";
import { optionName, optionTechStack } from "./command/common/commander-option";
import { cliErrorLog } from "./shared/error";
import {
    isErr,
    type Result,
    UNIT,
    createOk,
    type Unit
} from "ts-utility-kit/result";
import { getCurrentVersion } from "./command/common/command-core";
import { getLatestVersion } from "./helper/get-latest-version";
import { continueCurrentVersionCommand } from "./command/version/continue-current-version";

const handleSigTerm = () => process.exit(0);
const INSTALL_COMMAND =
    "npm i -g github:ShionTerunaga/frontend-template-cli#release";

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

export async function run(): Promise<RunSuccess> {
    await checkCliVersion();

    const projectName = await nameCommand(await optionName);

    if (isErr(projectName)) {
        cliErrorLog(projectName.err);
        process.exit(1);
    }

    const appPath = resolve(projectName.value);
    const appName = basename(appPath);

    const techStack = await techStackCommand(await optionTechStack);

    if (isErr(techStack)) {
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

    if (isErr(installResult)) {
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

    if (latestParts.length !== 3 || currentParts.length !== 3) {
        throw new Error(
            `Invalid version format. Expected format is "x.y.z". latestVersion: ${latestVersion}, currentVersion: ${currentVersion}`
        );
    }

    const length = latestParts.length;

    for (let i = 0; i < length; i++) {
        const latestPart = latestParts[i] ?? 0;
        const currentPart = currentParts[i] ?? 0;

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
    const currentVersionResult = await getCurrentVersion();

    if (isErr(currentVersionResult)) {
        return currentVersionResult;
    }

    const currentVersion = currentVersionResult.value;
    const latestVersionResult = await getLatestVersion();

    if (isErr(latestVersionResult)) {
        return latestVersionResult;
    }

    const latestVersion = latestVersionResult.value;

    if (!isNewerVersion(latestVersion, currentVersion)) {
        return createOk(UNIT);
    }

    log.warn(
        red(
            `A newer version of create-frontend-template is available. current: v${currentVersion}, latest: v${latestVersion}`
        )
    );

    const continueCurrentVersionResult = await continueCurrentVersionCommand();

    if (isErr(continueCurrentVersionResult)) {
        cliErrorLog(continueCurrentVersionResult.err);
        process.exit(1);
    }

    if (continueCurrentVersionResult.value) {
        return createOk(UNIT);
    }

    log.message(
        `Install the latest version with the following command:\n\n${bold(green(INSTALL_COMMAND))}`
    );
    process.exit(0);
}

function techInstallInfo(techStack: TechStack) {
    switch (techStack) {
        case "react": {
            reactCallback();
            break;
        }
        case "vue": {
            vueCallback();
            break;
        }
    }
}

export function notify(projectMaterial: RunSuccess): void {
    log.message("cd " + projectMaterial.name);

    techInstallInfo(projectMaterial.tech);

    log.success(bold(`${green("Happy hacking!")}`));

    process.exit(0);
}

export function errorExit() {
    console.error(red("The operation was cancelled."));

    process.exit(1);
}
