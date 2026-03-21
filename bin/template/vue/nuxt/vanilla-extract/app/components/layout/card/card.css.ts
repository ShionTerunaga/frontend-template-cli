import { style } from "@vanilla-extract/css";

const cardStyles = {
    cardContainer: style({
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: "1rem"
    }),
    image: style({
        objectFit: "cover"
    }),
    title: style({
        padding: "1rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#333",
        margin: 0
    })
};

export default cardStyles;
