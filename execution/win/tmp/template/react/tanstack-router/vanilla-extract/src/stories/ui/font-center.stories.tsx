import { FontCenter } from '@/components/ui'

const meta = {
    title: 'components/ui/font-center',
    component: FontCenter,
}

export default meta

export const Default = {
    args: {
        children: <div style={{ padding: 24 }}>Centered text</div>,
    },
}

export const Callout = {
    args: {
        style: {
            backgroundColor: '#f8fafc',
            borderRadius: 16,
            padding: 32,
        },
        children: <div>Centered callout block</div>,
    },
}
