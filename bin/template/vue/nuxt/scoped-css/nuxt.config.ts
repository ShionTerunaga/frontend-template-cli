const isStorybookEnabled = process.env.NUXT_STORYBOOK_ENABLED === "true";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
    components: [{ path: "~/app/components", extensions: ["vue"] }],
    storybook: {
        enabled: isStorybookEnabled
    },

    runtimeConfig: {
        public: {
            NUXT_PUBLIC_API_KEY: process.env.NUXT_PUBLIC_API_KEY
        }
    },

    modules: [
        "@nuxt/image",
        ...(isStorybookEnabled ? ["@nuxtjs/storybook"] : [])
    ]
};
