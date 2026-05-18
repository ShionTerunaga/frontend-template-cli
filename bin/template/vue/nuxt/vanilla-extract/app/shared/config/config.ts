import { envParse } from "ts-utility-kit";

export const appConfig = {
    get apiKey() {
        const config = useRuntimeConfig();
        return envParse(config.public.NUXT_PUBLIC_API_KEY);
    }
};
