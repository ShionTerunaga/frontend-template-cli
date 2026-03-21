import { styleVariants } from "@vanilla-extract/css";

export const boxVariants = {
    /**
     * 場合によっては、widthとheight、radiusを同じにする
     */
    boxWidthStyle: styleVariants({
        small: {
            width: 150
        },
        middle: {
            width: 300
        },
        big: {
            width: 450
        },
        auto: {
            width: "auto"
        },
        full: {
            width: "100vw"
        }
    }),
    boxHeightStyle: styleVariants({
        small: {
            height: 150
        },
        middle: {
            height: 300
        },
        big: {
            height: 450
        },
        auto: {
            height: "auto"
        },
        full: {
            height: "100vh"
        }
    }),
    boxBorderRadiusStyle: styleVariants({
        none: {
            borderRadius: 0
        },
        small: {
            borderRadius: 4
        },
        middle: {
            borderRadius: 8
        },
        big: {
            borderRadius: 16
        },
        full: {
            borderRadius: 9999
        }
    }),
    border: styleVariants({
        none: {
            border: "none"
        },
        thin: {
            border: "1px solid #E0E0E0"
        },
        middle: {
            border: "2px solid #C0C0C0"
        },
        thick: {
            border: "4px solid #A0A0A0"
        }
    }),
    boxShadowStyle: styleVariants({
        none: {
            boxShadow: "none"
        },
        small: {
            boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
        },
        middle: {
            boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
        },
        big: {
            boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"
        }
    }),
    colorStyle: styleVariants({
        white: {
            backgroundColor: "#FFFFFF",
            color: "#0F172A" // near-black (slightly softened)
        },
        lightGray: {
            backgroundColor: "#F2F4F8", // soft very light gray
            color: "#0F172A"
        },
        gray: {
            backgroundColor: "#E6E9EE", // softer gray
            color: "#0F172A"
        },
        darkGray: {
            backgroundColor: "#B8BDC6", // muted medium gray
            color: "#041426" // dark navy for better contrast
        },
        black: {
            backgroundColor: "#0B1220", // deep navy instead of pure black
            color: "#FFFFFF"
        },
        red: {
            backgroundColor: "#FF6B6B", // soft warm red
            color: "#1B1B1B" // near-black text
        },
        blue: {
            backgroundColor: "#5B8DEF", // soft sky blue
            color: "#062447" // dark blue text for contrast
        },
        green: {
            backgroundColor: "#7EE08A", // soft mint green
            color: "#062447" // dark blue/green text
        }
    })
};
