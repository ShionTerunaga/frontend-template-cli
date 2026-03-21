import { envParse } from "ts-common-by-teru";

export const appConfig = {
    get apiKey() {
        const config = useRuntimeConfig();
        return envParse(config.public.NUXT_PUBLIC_API_KEY);
    }
};
