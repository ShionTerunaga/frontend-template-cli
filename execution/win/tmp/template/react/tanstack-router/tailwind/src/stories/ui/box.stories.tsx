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
        children: <div className="p-5">Default box</div>,
    },
}

export const AccentCard = {
    args: {
        as: 'article',
        width: 'middle',
        boxShadow: 'middle',
        color: 'blue',
        border: 'thin',
        borderRadius: 'big',
        children: <div className="p-6">Accent card</div>,
    },
}
