import { envParse } from "ts-common-by-teru";

export const appConfig = {
    apiKey: envParse(process.env.NEXT_PUBLIC_API_KEY)
};
