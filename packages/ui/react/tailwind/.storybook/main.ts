import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    async viteFinal(baseConfig) {
        return mergeConfig(baseConfig, {
            plugins: [
                tsconfigPaths({
                    projects: ["tsconfig.json"],
                    ignoreConfigErrors: true
                }),
                tailwindcss(),
                vanillaExtractPlugin()
            ]
        });
    }
};

export default config;
