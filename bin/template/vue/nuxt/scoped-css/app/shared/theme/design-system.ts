import { appTheme } from "./theme";

export const textColor = {
    textNormal: appTheme.textNormal,
    textWhite: appTheme.white
} as const;

export const backgroundColor = {
    likeBlue: appTheme.likeBlue,
    likeGreen: appTheme.likeGreen,
    popupBackground: appTheme.popupBackground
};

export type TextTheme = keyof typeof textColor;
export type BackgroundTheme = keyof typeof backgroundColor;
