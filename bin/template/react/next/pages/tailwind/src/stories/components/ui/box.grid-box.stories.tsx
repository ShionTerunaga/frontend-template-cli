import { GridBox } from "@/components/ui/box/grid-box/grid-box";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
    title: "ui/grid-box",
    component: GridBox,
    parameters: {
        layout: "centered"
    }
} satisfies Meta<typeof GridBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleChildren = (
    <>
        <div style={{ padding: 16, background: "#f2f4f8" }}>Item 1</div>
        <div style={{ padding: 16, background: "#e6e9ee" }}>Item 2</div>
        <div style={{ padding: 16, background: "#e6e9ee" }}>Item 3</div>
        <div style={{ padding: 16, background: "#f2f4f8" }}>Item 4</div>
        <div style={{ padding: 16, background: "#e6e9ee" }}>Item 5</div>
    </>
);

export const Default: Story = {
    args: {
        children: sampleChildren
    }
};

export const SmallGapThree: Story = {
    args: {
        gap: "smallGap",
        gridTemplateColumns: "three",
        children: sampleChildren
    }
};

export const MediumGapFour: Story = {
    args: {
        gap: "medium",
        gridTemplateColumns: "four",
        children: sampleChildren
    }
};

export const LargeGapFive: Story = {
    args: {
        gap: "large",
        gridTemplateColumns: "five",
        children: sampleChildren
    }
};
