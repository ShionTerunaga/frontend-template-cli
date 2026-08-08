import { Card } from "@/components/layout/card/card";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
    title: "layouts/card",
    component: Card,
    parameters: {
        layout: "fullscreen"
    }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample1: Story = {
    args: {
        key: "sample1",
        title: "sample",
        src: "https://placehold.jp/150x150.png",
        alt: "",
        boxHeight: 250,
        srcWidth: 150,
        srcHeight: 150
    }
};

export const Sample2: Story = {
    args: {
        key: "sample2",
        title: "sample",
        src: "https://placehold.jp/250x300.png",
        alt: "",
        boxHeight: 400,
        srcWidth: 300,
        srcHeight: 250
    }
};
