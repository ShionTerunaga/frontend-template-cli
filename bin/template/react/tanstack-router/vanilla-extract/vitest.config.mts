import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths({
            projects: ['./tsconfig.json'],
            ignoreConfigErrors: true,
        }),
        react(),
        vanillaExtractPlugin(),
    ],
    test: {
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
        },
    },
});
