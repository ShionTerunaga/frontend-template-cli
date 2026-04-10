import type { StorybookConfig } from "@nuxtjs/storybook";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook-vue/nuxt",
        options: {}
    }
};

export default config;
