import { envParse } from 'ts-shared'

export const appConfig = {
  apiKey: envParse(import.meta.env.VITE_API_KEY),
}
