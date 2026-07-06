import { isNone, optionConversion } from "ts-utility-kit/option";
import { createErr, createOk, isErr, type Result } from "ts-utility-kit/result";
import { Command } from "commander";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cancel, isCancel } from "@clack/prompts";

export async function getCurrentVersion(): Promise<Result<string, Error>> {
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const versionJsonPath = path.join(cliDir, "version.json");

    const versionJson = JSON.parse(await readFile(versionJsonPath, "utf8")) as {
        version?: string;
    };

    const optionVersion = optionConversion(versionJson.version);

    if (isNone(optionVersion)) {
        return createErr(new Error("version is not found in version.json"));
    }

    return createOk(optionVersion.value);
}

export const commanderCore = (async function () {
    const currentVersionResult = await getCurrentVersion();
    if (isErr(currentVersionResult)) {
        console.error(currentVersionResult.err);
        process.exit(1);
    }
    const currentVersion = currentVersionResult.value;

    const program = new Command("create-frontend-template")
        .version(currentVersion, "-v, --version", "output the current version")
        .argument("[directory]")
        .usage("[directory] [options]")
        .helpOption("-h, --help", "display help for command")
        .allowUnknownOption()
        .option("-n, --name <name>", "specify the project name")
        .option("-t, --tech-stack <techStack>", "specify the tech stack(react)")
        .option(
            "--rf, --react-framework <reactFramework>",
            "framework to use (tanstack-router | next/app | next/pages)"
        )
        .option(
            "--vf, --vue-framework <vueFramework>",
            "vue framework to use (vue-router | nuxt)"
        )
        .option(
            "-c,--css <css>",
            "select css framework (tailwind | vanilla-extract | scoped-css)"
        )
        .option("--use-all-components", "install all available components")
        .parse(process.argv);

    return program;
})();

export function onPromptCancel(value: unknown) {
    if (isCancel(value)) {
        cancel("Operation cancelled.");
        process.exit(1);
    }
}
