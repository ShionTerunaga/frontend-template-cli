import type { CheckerProps } from '@/shared/types/object'
import type { ChildrenOnly } from '@/shared/types/react'
import { classMerger } from 'ts-shared'
import type { CSSProperties, ElementType } from 'react'

interface Props extends ChildrenOnly {
    as?: Extract<ElementType, 'div' | 'section' | 'article' | 'main' | 'p'>
    className?: string
    style?: Omit<CSSProperties, 'center'>
}

export function FontCenter<T extends Props>(
    props: CheckerProps<T, Props, 'fontCenter has not any props.'>,
) {
    const { as = 'p', className, style, children } = props

    const Component = as

    const cn = classMerger(['text-center', className ?? ''])

    const asProps = {
        className: cn,
        style,
        children,
    }

    return <Component {...asProps} />
}
