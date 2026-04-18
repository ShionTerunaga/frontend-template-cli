import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";

const appDir = fileURLToPath(new URL("./app", import.meta.url));

export default mergeConfig(
    defineConfig({
        resolve: {
            alias: {
                "@": appDir,
                "~": appDir
            }
        },
        test: {
            environment: "jsdom",
            exclude: [...configDefaults.exclude, "e2e/**"],
            root: fileURLToPath(new URL("./", import.meta.url))
        }
    })
);
