import { style } from "@vanilla-extract/css";

const characterListStyle = {
    gridBoxBaseStyles: style({
        display: "grid",
        justifyItems: "center",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 24
    }),
    titleStyles: style({
        fontSize: "24px",
        textAlign: "center"
    })
};

export default characterListStyle;
