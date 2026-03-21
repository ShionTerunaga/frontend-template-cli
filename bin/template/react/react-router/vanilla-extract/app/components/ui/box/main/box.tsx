import { type ChildrenOnly } from '@/shared/types/react'
import { boxVariants } from './box.css'
import type { CheckerProps } from '@/shared/types/object'
import { type ElementType } from 'react'
import { classMerger } from 'ts-common-by-teru'

/**
 * Box Width Type
 */
export type BoxWidth = keyof typeof boxVariants.boxWidthStyle
/**
 * Box Height Type
 */
export type BoxHeight = keyof typeof boxVariants.boxHeightStyle
/**
 * Box Shadow Type
 */
export type BoxShadow = keyof typeof boxVariants.boxShadowStyle
/**
 * Box Color Type
 */
export type BoxColor = keyof typeof boxVariants.colorStyle
/**
 * Box Border Type
 */
export type BoxBorder = keyof typeof boxVariants.border
/**
 * Box Border Radius Type
 */
export type BoxBorderRadius = keyof typeof boxVariants.boxBorderRadiusStyle

/**
 * Box Style Interface
 * @property {Extract<ElementType, 'div' | 'section' | 'article' | 'main'>} [as='div'] - The HTML element type to render as.
 * @property {BoxWidth} [width='auto'] - The width of the box.
 * @property {BoxHeight} [height='auto'] - The height of the box.
 * @property {BoxShadow} [boxShadow='none'] - The box shadow style.
 * @property {BoxColor} [color='white'] - The background color of the box.
 * @property {BoxBorder} [border='none'] - The border style of the box.
 * @property {BoxBorderRadius} [borderRadius='none'] - The border radius of the box.
 * @property {React.CSSProperties} [style] - Additional inline styles for the box.
 * @property {string} [className] - Additional class names for the box.
 */
interface BoxStyle {
    as?: Extract<ElementType, 'div' | 'section' | 'article' | 'main'>
    width?: BoxWidth
    height?: BoxHeight
    boxShadow?: BoxShadow
    color?: BoxColor
    border?: BoxBorder
    borderRadius?: BoxBorderRadius
    style?: React.CSSProperties
    className?: string
}

interface BoxProps extends BoxStyle, ChildrenOnly {}

/**
 * Box Component
 * @param props - Props for the Box component
 * @returns - A JSX element representing the Box component
 */
export function Box<T extends BoxProps>(
    props: CheckerProps<T, BoxProps, 'Box Props Error'>,
) {
    const {
        as = 'div',
        width = 'auto',
        height = 'auto',
        boxShadow = 'none',
        color = 'white',
        border = 'none',
        borderRadius = 'none',
        className = '',
        style,
        children,
    } = props

    const cn = classMerger([
        boxVariants.boxWidthStyle[width],
        boxVariants.boxHeightStyle[height],
        boxVariants.boxShadowStyle[boxShadow],
        boxVariants.colorStyle[color],
        boxVariants.border[border],
        boxVariants.boxBorderRadiusStyle[borderRadius],
        className,
    ])

    const As = as

    return (
        <As className={cn} style={style}>
            {children}
        </As>
    )
}
