import type { CSSProperties } from 'react'

export const appTheme = {
    textNormal: '#333',
    white: '#FFFFFF',
    likeBlue: 'aqua',
    likeGreen: '#33FFCC',
    popupBackground: 'rgba(0,0,0,0.6)',
}

export type Color =
    | `var(--${string})`
    | CSSProperties['color']
    | Array<`var(--${string})` | CSSProperties['color'] | undefined>

export type AppTheme = typeof appTheme
