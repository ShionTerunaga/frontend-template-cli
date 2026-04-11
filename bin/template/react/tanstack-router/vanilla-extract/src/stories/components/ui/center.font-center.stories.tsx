import { FontCenter } from '@/components/ui/center/font-center/font-center'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
    title: 'ui/font-center',
    component: FontCenter,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof FontCenter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: <div style={{ padding: 24 }}>Centered text</div>,
    },
}

export const WithPadding: Story = {
    args: {
        style: { padding: 48 },
        children: <div>More padded centered text</div>,
    },
}

export const WithBackground: Story = {
    args: {
        style: { padding: 24, backgroundColor: '#f2f4f8' },
        children: <div>Centered with background</div>,
    },
}

export const WithCustomClass: Story = {
    args: {
        className: 'custom-font-center',
        children: <div>Centered with custom class</div>,
    },
}
