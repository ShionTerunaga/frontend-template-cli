import { mergeConfig } from 'vite'
import { StorybookConfig } from '@storybook/react-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
    addons: ['@storybook/addon-essentials'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    async viteFinal(config_, { configType }) {
        // merge with the project's Vite config if necessary
        return mergeConfig(config_, {
            plugins: [tsconfigPaths(), vanillaExtractPlugin()],
        })
    },
}

export default config
