import { type TechStack } from "./core-static";
import { reactInstaller } from "../react/react-installer";
import { vueCli } from "../vue/vue-setting";
import { vueInstaller } from "../vue/vue-install";
import { reactCli } from "../react/react-setting";
import type { Result, Unit } from "ts-shared";

export async function createApp({
    appPath,
    tech
}: {
    appPath: string;
    tech: TechStack;
}): Promise<Result<Unit, Error>> {
    switch (tech) {
        case "react": {
            const materialResult = await reactCli();

            if (materialResult.isErr) {
                return materialResult;
            }

            return await reactInstaller({
                appPath,
                material: materialResult.value
            });
        }
        case "vue": {
            const materialResult = await vueCli();

            if (materialResult.isErr) {
                return materialResult;
            }

            return await vueInstaller({
                appPath,
                material: materialResult.value
            });
        }
    }
}
