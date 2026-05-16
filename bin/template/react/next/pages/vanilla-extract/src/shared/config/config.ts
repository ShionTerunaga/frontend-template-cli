import { envParse } from "ts-shared";

export const appConfig = {
    apiKey: envParse(process.env.NEXT_PUBLIC_API_KEY)
};
