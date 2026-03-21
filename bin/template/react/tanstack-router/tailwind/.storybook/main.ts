import type { StorybookConfig } from '@storybook/react-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

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
        config.plugins.push(tsconfigPaths())
        return config
    },
}
export default config
