import { appTheme } from './theme'

// Tailwind class maps (previously vanilla-extract styleVariants)
// If custom theme colors differ from Tailwind palette, create matching entries in tailwind.config.js.
export const textColor = {
    textNormal: `text-[${appTheme.textNormal}]`, // fallback to arbitrary color if not in palette
    textWhite: 'text-white',
} as const

export const backgroundColor = {
    likeBlue: `bg-[${appTheme.likeBlue}]`,
    likeGreen: `bg-[${appTheme.likeGreen}]`,
    popupBackground: `bg-[${appTheme.popupBackground}]`,
} as const

export type TextTheme = keyof typeof textColor
export type BackgroundTheme = keyof typeof backgroundColor
