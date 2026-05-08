import { mergeConfig } from 'vite'
import { StorybookConfig } from '@storybook/react-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'

const tsconfigPath = fileURLToPath(new URL('../tsconfig.json', import.meta.url))

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
    addons: [],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    async viteFinal(config_, { configType }) {
        // merge with the project's Vite config if necessary
        return mergeConfig(config_, {
            plugins: [
                tsconfigPaths({
                    projects: [tsconfigPath],
                    ignoreConfigErrors: true,
                }),
                vanillaExtractPlugin(),
            ],
        })
    },
}

export default config
