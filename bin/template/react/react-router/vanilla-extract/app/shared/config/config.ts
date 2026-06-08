import { optionConversion } from 'ts-utility-kit/option'

export const appConfig = {
    apiKey: optionConversion(import.meta.env.VITE_API_KEY),
    apiKey2: optionConversion(import.meta.env.VITE_API_KEY2),
}
