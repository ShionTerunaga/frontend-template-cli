import { Property } from "csstype";

export const appTheme = {
    textNormal: "#333",
    white: "#FFFFFF",
    likeBlue: "aqua",
    likeGreen: "#33FFCC",
    popupBackground: "rgba(0,0,0,0.6)"
};

export type Color =
    | `var(--${string})`
    | Property.Color
    | (`var(--${string})` | Property.Color | undefined)[];

export type AppTheme = typeof appTheme;
