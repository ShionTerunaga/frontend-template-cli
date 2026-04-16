import { optionUtility, type Result, resultUtility } from "ts-shared";
import { Command } from "commander";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { InitialReturnValue } from "prompts";

export async function getCurrentVersion(): Promise<Result<string, Error>> {
    const { optionConversion } = optionUtility;
    const { createNg, createOk } = resultUtility;
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const versionJsonPath = path.join(cliDir, "version.json");

    const versionJson = JSON.parse(await readFile(versionJsonPath, "utf8")) as {
        version?: string;
    };

    const optionVersion = optionConversion(versionJson.version);

    if (optionVersion.isNone) {
        return createNg(new Error("version is not found in version.json"));
    }

    return createOk(optionVersion.value);
}

export const commanderCore = (async function () {
    const currentVersionResult = await getCurrentVersion();
    if (currentVersionResult.isErr) {
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

export function onPromptState(state: {
    value: InitialReturnValue;
    aborted: boolean;
    exited: boolean;
}) {
    if (state.aborted) {
        process.stdout.write("\x1B[?25h");
        process.stdout.write("\n");
        process.exit(1);
    }
}
