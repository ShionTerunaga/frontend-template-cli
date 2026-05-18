import { envParse } from 'ts-utility-kit'

export const appConfig = {
    apiKey: envParse(import.meta.env.VITE_API_KEY),
}
