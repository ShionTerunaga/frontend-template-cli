import { envParse } from "ts-common-by-teru";

export const appConfig = {
    apiKey: envParse(process.env.API_KEY),
    apiKey2: envParse(process.env.API_KEY2)
};
