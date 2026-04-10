import { Heading } from '@/components/ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
    title: 'ui/heading',
    component: Heading,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        as: 'h1',
        fontStyle: 'firstBig',
        color: 'textNormal',
        children: <>hello</>,
    },
}
