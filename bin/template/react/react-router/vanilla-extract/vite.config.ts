import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import babel from 'vite-plugin-babel'

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        tsconfigPaths({
            ignoreConfigErrors: true,
            skip: (dir) => dir.includes('/template'),
        }),
        vanillaExtractPlugin(),
        babel({
            babelConfig: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
    ],
})
