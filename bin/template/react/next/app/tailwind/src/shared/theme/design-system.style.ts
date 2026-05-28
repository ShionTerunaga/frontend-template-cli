// Tailwind class maps must remain static strings so the classes are generated.
export const textColor = {
    textNormal: "text-[#333]",
    textWhite: "text-white"
} as const;

export const backgroundColor = {
    likeBlue: "bg-[aqua]",
    likeGreen: "bg-[#33FFCC]",
    popupBackground: "bg-[rgba(0,0,0,0.6)]"
} as const;

export type TextTheme = keyof typeof textColor;
export type BackgroundTheme = keyof typeof backgroundColor;
