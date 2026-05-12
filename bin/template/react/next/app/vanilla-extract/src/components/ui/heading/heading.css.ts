import { styleVariants } from "@vanilla-extract/css";

export const headingFontStyle = styleVariants({
    firstSmall: {
        fontSize: 18,
        fontWeight: 400
    },
    firstMiddle: {
        fontSize: 24,
        fontWeight: 500
    },
    firstBig: {
        fontSize: 32,
        fontWeight: 600
    }
});
