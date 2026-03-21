export default {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
    },
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
        // enforce using `import type` for type-only imports
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" }
        ],

        // treat unused vars as warnings (helpful during development)
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { vars: "all", args: "after-used", ignoreRestSiblings: true }
        ],
        // disable base rule in favor of the TS rule
        "no-unused-vars": "off"
    }
};
