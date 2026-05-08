import { style } from "@vanilla-extract/css";

const serverActionSamplePageStyle = {
    page: style({
        minHeight: "100dvh",
        padding: "64px 24px",
        background:
            "radial-gradient(circle at top right, #bfdbfe 0%, #e2e8f0 30%, #f8fafc 100%)"
    }),
    inner: style({
        maxWidth: 960,
        margin: "0 auto",
        borderRadius: 24,
        border: "1px solid #dbe1ea",
        background: "rgba(255, 255, 255, 0.82)",
        padding: "28px 20px 36px"
    }),
    title: style({
        textAlign: "center"
    })
};

export default serverActionSamplePageStyle;
