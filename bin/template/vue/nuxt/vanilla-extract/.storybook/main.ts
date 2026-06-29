import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/vue3-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import vue from "@vitejs/plugin-vue";
import { mergeConfig } from "vite";

const appDir = fileURLToPath(new URL("../app", import.meta.url));

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/vue3-vite",
        options: {}
    },
    viteFinal: async (config) =>
        mergeConfig(config, {
            resolve: {
                alias: {
                    "@": appDir,
                    "~": appDir
                }
            },
            plugins: [vue(), vanillaExtractPlugin()]
        })
};

export default config;
