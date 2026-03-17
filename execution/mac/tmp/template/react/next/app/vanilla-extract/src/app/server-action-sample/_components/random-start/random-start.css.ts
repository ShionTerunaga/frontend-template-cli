import { style } from "@vanilla-extract/css";

const randomStartStyle = {
    root: style({
        marginTop: 24,
        maxWidth: 540,
        marginInline: "auto",
        border: "1px solid #dbe1ea",
        borderRadius: 16,
        padding: 20,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.1)"
    }),
    preview: style({
        minHeight: 140,
        display: "grid",
        placeItems: "center",
        border: "1px dashed #cbd5e1",
        borderRadius: 12,
        background: "#f1f5f9",
        marginBottom: 16
    }),
    image: style({
        borderRadius: 10,
        border: "1px solid #e2e8f0"
    }),
    errorText: style({
        color: "#b91c1c",
        fontWeight: 600
    }),
    button: style({
        border: "none",
        borderRadius: 9999,
        padding: "10px 16px",
        fontSize: "0.95rem",
        fontWeight: 700,
        color: "#ffffff",
        background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
        cursor: "pointer",
        transition:
            "transform .15s ease, box-shadow .2s ease, opacity .2s ease",
        selectors: {
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.35)"
            },
            "&:active": {
                transform: "translateY(0)"
            },
            "&:disabled": {
                opacity: 0.6,
                cursor: "not-allowed"
            }
        }
    })
};

export default randomStartStyle;
