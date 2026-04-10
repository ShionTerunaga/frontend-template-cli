module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}"
    ],
    // Safelist dynamically-generated arbitrary classes such as bg-[#fff] or bg-[rgba(...)]
    // These patterns ensure Tailwind includes runtime-generated arbitrary values used in
    // `src/shared/theme/design-system.css.ts` (e.g. `bg-[${appTheme.popupBackground}]`).
    safelist: [
        { pattern: /bg-\[.*\]/ },
        { pattern: /text-\[.*\]/ },
        // common palette utilities
        { pattern: /bg-(slate|gray|red|blue|green|white|black)-\d{2,3}/ },
        { pattern: /text-(slate|gray|red|blue|green|white|black)-\d{2,3}/ }
    ],
    theme: {
        extend: {}
    },
    plugins: []
};
