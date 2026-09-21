import { cancel, isCancel, select } from "@clack/prompts";
import { Command } from "commander";
import {
    techStacks,
    templateCliConfig,
    type TechStack
} from "@/shared/template-cli";

function isTechStack(value: unknown): value is TechStack {
    return typeof value === "string" && techStacks.includes(value as TechStack);
}

export async function techStackCommand(
    currentVersion: string
): Promise<TechStack> {
    const program = new Command("create-frontend-template")
        .version(currentVersion, "-v, --version", "output the current version")
        .helpOption("-h, --help", "display help for command")
        .option(
            "-t, --tech-stack <techStack>",
            "specify the tech stack (react | vue)"
        )
        .parse(process.argv);

    const optionTech = program.opts().techStack;

    if (optionTech !== undefined) {
        if (isTechStack(optionTech)) {
            return optionTech;
        }

        throw new Error("Tech stack selection is invalid");
    }

    const response = await select({
        message: "Select a tech stack for your project:",
        options: techStacks.map((value) => ({
            label: templateCliConfig[value].title,
            value
        })),
        initialValue: techStacks[0]
    });

    if (isCancel(response)) {
        cancel("Operation cancelled.");
        process.exit(1);
    }

    return response;
}
