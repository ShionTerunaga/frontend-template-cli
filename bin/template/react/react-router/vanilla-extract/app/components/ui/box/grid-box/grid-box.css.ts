import { style, styleVariants } from "@vanilla-extract/css";

//本来プロジェクトでgapのパターンがいくつかあったら定義する
export const gridBoxGap = styleVariants({
    smallGap: {
        gap: 8
    },
    medium: {
        gap: 16
    },
    large: {
        gap: 24
    }
});

export const gridBoxGridTemplate = styleVariants({
    three: {
        gridTemplateColumns: "repeat(3, 1fr)"
    },
    four: {
        gridTemplateColumns: "repeat(4, 1fr)"
    },
    five: {
        gridTemplateColumns: "repeat(5, 1fr)"
    }
});

export const gridBoxBaseStyles = style({
    display: "grid",
    justifyItems: "center"
});
