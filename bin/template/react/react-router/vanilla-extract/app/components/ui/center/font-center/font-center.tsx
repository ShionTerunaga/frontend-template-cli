import { type CheckerProps } from '@/shared/types/object'
import { type ChildrenOnly } from '@/shared/types/react'
import { type CSSProperties } from 'react'
import fontCenterBaseStyle from './font-center.css'

interface Props extends ChildrenOnly {
    className?: string
    style?: Omit<CSSProperties, 'center'>
}

function FontCenter<T extends Props>(
    props: CheckerProps<T, Props, 'fontCenter has not any props.'>,
) {
    if (typeof props !== 'object') {
        throw Error('runtime error')
    }

    const { className, style, children } = props

    return (
        <p className={`${fontCenterBaseStyle} ${className}`} style={style}>
            {children}
        </p>
    )
}

export default FontCenter
