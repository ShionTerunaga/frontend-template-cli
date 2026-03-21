import { envParse } from 'ts-common-by-teru'

export const appConfig = {
  apiKey: envParse(import.meta.env.VITE_API_KEY),
}
