import { style } from "@vanilla-extract/css";

const cardStyles = {
    cardContainer: style({
        border: "1px solid #dbe1ea",
        borderRadius: 18,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
        textAlign: "center",
        margin: "0.8rem",
        transition:
            "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        selectors: {
            "&:hover": {
                transform: "translateY(-4px)",
                borderColor: "#93c5fd",
                boxShadow: "0 20px 36px rgba(30, 64, 175, 0.22)"
            }
        }
    }),
    image: style({
        objectFit: "cover",
        width: "100%",
        borderBottom: "1px solid #e2e8f0"
    }),
    title: style({
        padding: "0.9rem",
        fontSize: "1rem",
        fontWeight: 700,
        color: "#0f172a",
        lineHeight: 1.35,
        margin: 0
    })
};

export default cardStyles;
