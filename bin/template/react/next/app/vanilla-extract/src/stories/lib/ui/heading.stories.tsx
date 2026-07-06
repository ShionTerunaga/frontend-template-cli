import { Heading } from "@/lib/ui";

const meta = {
    title: "lib/ui/heading",
    component: Heading,
    parameters: {
        layout: "padded"
    }
};
export default meta;

export const Primary = {
    args: {
        as: "h1",
        fontStyle: "firstBig",
        color: "textNormal",
        children: "Vanilla Extract Heading"
    }
};

export const OnDark = {
    args: {
        as: "h2",
        fontStyle: "firstMiddle",
        color: "textWhite",
        children: "Readable on dark backgrounds"
    }
};
