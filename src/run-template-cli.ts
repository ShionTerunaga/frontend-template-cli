import { spawn } from "node:child_process";
import { templateCliConfig, type TechStack } from "./shared/template-cli";

export async function runTemplateCli(techStack: TechStack): Promise<void> {
    const { command, args } = templateCliConfig[techStack];
    const executable =
        process.platform === "win32" ? `${command}.cmd` : command;

    await new Promise<void>((resolve, reject) => {
        const child = spawn(executable, args, {
            stdio: "inherit"
        });

        child.once("error", reject);
        child.once("close", (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }

            const reason = signal
                ? `signal ${signal}`
                : `exit code ${code ?? "unknown"}`;

            reject(new Error(`${command} terminated with ${reason}`));
        });
    });
}
