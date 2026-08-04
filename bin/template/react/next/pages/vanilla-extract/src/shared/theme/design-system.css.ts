import { styleVariants } from "@vanilla-extract/css";
import { appTheme } from "./theme";

export const textColor = styleVariants({
    textNormal: { color: appTheme.textNormal },
    textWhite: { color: appTheme.white }
});

export const backgroundColor = styleVariants({
    likeBlue: { backgroundColor: appTheme.likeBlue },
    likeGreen: { backgroundColor: appTheme.likeGreen },
    popupBackground: { backgroundColor: appTheme.popupBackground }
});

export type TextTheme = keyof typeof textColor;
export type BackgroundTheme = keyof typeof backgroundColor;
