import { Box } from '@/components/ui'

const meta = {
    title: 'components/ui/box',
    component: Box,
}

export default meta

export const Default = {
    args: {
        width: 'middle',
        boxShadow: 'small',
        color: 'white',
        borderRadius: 'middle',
        children: <div style={{ padding: 20 }}>Default box</div>,
    },
}

export const AccentCard = {
    args: {
        as: 'article',
        width: 'middle',
        boxShadow: 'middle',
        color: 'green',
        border: 'thin',
        borderRadius: 'big',
        children: <div style={{ padding: 24 }}>Accent card</div>,
    },
}
