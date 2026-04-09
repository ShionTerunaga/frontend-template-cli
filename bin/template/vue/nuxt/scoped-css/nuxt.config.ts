// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: [{ path: "~/app/components", extensions: ["vue"] }],
    storybook: {
        enabled: process.env.NUXT_STORYBOOK_ENABLED === "true"
    },

    runtimeConfig: {
        public: {
            NUXT_PUBLIC_API_KEY: process.env.NUXT_PUBLIC_API_KEY
        }
    },

    modules: ["@nuxt/image", "@nuxtjs/storybook"]
});
