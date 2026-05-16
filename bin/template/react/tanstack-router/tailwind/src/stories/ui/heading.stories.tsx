import { Heading } from '@/components/ui'

const meta = {
    title: 'components/ui/heading',
    component: Heading,
    parameters: {
        layout: 'padded',
    },
}
export default meta

export const Primary = {
    args: {
        as: 'h1',
        fontStyle: 'firstBig',
        color: 'textNormal',
        children: 'Tailwind Heading',
    },
}

export const Inverted = {
    args: {
        as: 'h2',
        fontStyle: 'firstMiddle',
        color: 'textWhite',
        children: 'Readable on dark backgrounds',
    },
}
