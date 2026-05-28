import type { StorybookConfig } from "@storybook/vue3-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/vue3-vite",
        options: {}
    },
    viteFinal: async (config) =>
        mergeConfig(config, {
            plugins: [vanillaExtractPlugin()]
        })
};

export default config;
