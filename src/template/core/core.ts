import { type TechStack } from "./core-static";
import { reactInstaller } from "../react/react-installer";
import { vueCli } from "../vue/vue-setting";
import { vueInstaller } from "../vue/vue-install";
import { reactCli } from "../react/react-setting";
import { isErr, type Result, type Unit } from "ts-utility-kit/result";

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

            if (isErr(materialResult)) {
                return materialResult;
            }

            return await reactInstaller({
                appPath,
                material: materialResult.value
            });
        }
        case "vue": {
            const materialResult = await vueCli();

            if (isErr(materialResult)) {
                return materialResult;
            }

            return await vueInstaller({
                appPath,
                material: materialResult.value
            });
        }
    }
}
