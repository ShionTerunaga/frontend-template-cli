import { envParse } from "ts-utility-kit";

export const appConfig = {
    apiKey: envParse(process.env.NEXT_PUBLIC_API_KEY)
};
