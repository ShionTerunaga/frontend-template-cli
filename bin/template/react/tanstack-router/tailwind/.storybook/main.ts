import type { StorybookConfig } from '@storybook/react-vite'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'

const tsconfigPath = fileURLToPath(new URL('../tsconfig.json', import.meta.url))

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    async viteFinal(config) {
        const { default: tailwindcss } = await import('@tailwindcss/vite')
        config.plugins = config.plugins || []
        config.plugins.push(tailwindcss())
        config.plugins.push(
            tsconfigPaths({
                projects: [tsconfigPath],
                ignoreConfigErrors: true,
            }),
        )
        return config
    },
}
export default config
