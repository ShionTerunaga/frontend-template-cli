import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

// ESM: define __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        {
            name: "@storybook/addon-styling-webpack",
            options: {
                rules: [
                    {
                        test: /\.css$/,
                        sideEffects: true,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {}
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    postcssOptions: {
                                        config: path.resolve(
                                            __dirname,
                                            "../postcss.config.mjs"
                                        )
                                    }
                                }
                            }
                        ],
                        exclude: /\.vanilla\.css$/
                    }
                ]
            }
        }
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {}
    },
    staticDirs: ["../public"]
};

export default config;
