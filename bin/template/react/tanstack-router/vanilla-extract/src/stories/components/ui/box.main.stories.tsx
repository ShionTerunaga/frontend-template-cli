import { Box } from '../../../components/ui/box/main/box'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
    title: 'ui/box',
    component: Box,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Box>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        as: 'div',
        width: 'middle',
        height: 'auto',
        boxShadow: 'small',
        color: 'white',
        children: <div style={{ padding: 16 }}>Default Box</div>,
    },
}

export const FullWidthDark: Story = {
    args: {
        as: 'section',
        width: 'full',
        height: 'auto',
        boxShadow: 'none',
        color: 'darkGray',
        children: <div style={{ padding: 24 }}>Full width dark box</div>,
    },
}

export const SmallGreenCard: Story = {
    args: {
        as: 'article',
        width: 'small',
        height: 'small',
        boxShadow: 'middle',
        color: 'green',
        border: 'thin',
        borderRadius: 'small',
        children: <div style={{ padding: 12 }}>Small green card</div>,
    },
}

export const RedAttention: Story = {
    args: {
        as: 'div',
        width: 'auto',
        height: 'auto',
        boxShadow: 'big',
        color: 'red',
        children: <div style={{ padding: 18 }}>Attention box</div>,
    },
}

export const BlackBanner: Story = {
    args: {
        as: 'section',
        width: 'full',
        height: 'middle',
        boxShadow: 'none',
        color: 'black',
        children: <div style={{ padding: 24 }}>Black banner</div>,
    },
}

export const RoundedCard: Story = {
    args: {
        as: 'article',
        width: 'middle',
        height: 'middle',
        boxShadow: 'small',
        color: 'lightGray',
        border: 'thin',
        borderRadius: 'middle',
        children: <div style={{ padding: 20 }}>Rounded card</div>,
    },
}

export const ThinBorderBox: Story = {
    args: {
        as: 'div',
        width: 'auto',
        height: 'auto',
        boxShadow: 'none',
        color: 'white',
        border: 'thin',
        children: <div style={{ padding: 12 }}>Thin bordered box</div>,
    },
}

export const ThickBorderProminent: Story = {
    args: {
        as: 'section',
        width: 'big',
        height: 'auto',
        boxShadow: 'middle',
        color: 'blue',
        border: 'thick',
        borderRadius: 'small',
        children: <div style={{ padding: 28 }}>Prominent bordered box</div>,
    },
}

export const FullRoundedBanner: Story = {
    args: {
        as: 'div',
        width: 'full',
        height: 'small',
        boxShadow: 'small',
        color: 'gray',
        border: 'none',
        borderRadius: 'full',
        children: <div style={{ padding: 30 }}>Full rounded banner</div>,
    },
}

export const CustomStyled: Story = {
    args: {
        as: 'article',
        width: 'middle',
        height: 'auto',
        boxShadow: 'small',
        color: 'white',
        style: { display: 'flex', justifyContent: 'space-between', gap: 12 },
        children: (
            <>
                <div>Left</div>
                <div>Right</div>
            </>
        ),
    },
}
