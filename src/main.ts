import { basename, resolve } from "node:path";
import { validateNpmName } from "./helper/validate-npm-name";
import { existsSync } from "node:fs";
import { bold, red, green } from "picocolors";
import { commanderCore } from "./command/common/command-core";
import { nameCommand } from "./command/common/project-name";
import { cliErrorLog } from "./utils/error";
import { techStackCommand } from "./command/common/tech-stack";
import { createApp } from "./template/core/core";
import type { RunSuccess, TechStack } from "./template/core/core-static";
import { reactCallback } from "./then";

const handleSigTerm = () => process.exit(0);

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

export async function run(): Promise<RunSuccess> {
    const { optionName, optionTechStack } = await commanderCore;

    const projectName = await nameCommand(optionName);

    if (projectName.isErr) {
        cliErrorLog(projectName.err);
        process.exit(1);
    }

    const appPath = resolve(projectName.value);
    const appName = basename(appPath);

    const techStack = await techStackCommand(optionTechStack);

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
