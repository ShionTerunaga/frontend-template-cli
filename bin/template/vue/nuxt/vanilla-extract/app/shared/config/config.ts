import { optionConversion } from "ts-utility-kit/option";

export const appConfig = {
    get apiKey() {
        const config = useRuntimeConfig();
        return optionConversion(config.public.NUXT_PUBLIC_API_KEY);
    }
};
