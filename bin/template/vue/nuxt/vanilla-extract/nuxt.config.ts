import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: [{ path: "~/app/components", extensions: ["vue"] }],
    vite: {
        plugins: [vanillaExtractPlugin()]
    },

    runtimeConfig: {
        public: {
            NUXT_PUBLIC_API_KEY: process.env.NUXT_PUBLIC_API_KEY
        }
    },

    modules: ["@nuxt/image"]
});
