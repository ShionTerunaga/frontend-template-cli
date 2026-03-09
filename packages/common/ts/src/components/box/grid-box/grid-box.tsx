import type { ChildrenOnly } from '@/shared/types/react'
import {
    gridBoxBaseStyles,
    gridBoxGap,
    gridBoxGridTemplate,
} from './grid-box.css'
import type { CheckerProps } from '@/shared/types/object'
import { Box } from '../main/box'
import classMerger from '@/utils/class-merger'

interface Props extends ChildrenOnly {
    gap?: keyof typeof gridBoxGap
    gridTemplateColumns?: keyof typeof gridBoxGridTemplate
}

export function GridBox<T extends Props>(
    props: CheckerProps<T, Props, 'type error'>,
) {
    const { children, gap = 'large', gridTemplateColumns = 'three' } = props

    const className: string = classMerger([
        gridBoxGap[gap],
        gridBoxGridTemplate[gridTemplateColumns],
        gridBoxBaseStyles,
    ])

    return <Box className={className}>{children}</Box>
}
