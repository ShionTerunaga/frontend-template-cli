import { CheckerProps } from "@/shared/types/object";
import { headingFontStyle } from "./heading.css";
import { textColor, TextTheme } from "@/shared/theme/design-system.css";
import { ChildrenOnly } from "@/shared/types/react";
import { ElementType } from "react";
import classMerger from "@/utils/class-merger";

type HeadingFont = keyof typeof headingFontStyle;
interface HeadingStyle {
    as?: Extract<ElementType, "h1" | "h2" | "h3">;
    fontStyle?: HeadingFont;
    color?: TextTheme;
    className?: string;
    style?: React.CSSProperties;
}
interface HeadingProps extends HeadingStyle, ChildrenOnly {}

export function Heading<T extends HeadingProps>(
    props: CheckerProps<T, HeadingProps, "Heading Props Error">
) {
    const {
        as = "h1",
        fontStyle = "firstBig",
        color = "textNormal",
        className = "",
        style,
        children
    } = props;

    const cn = classMerger([
        className,
        headingFontStyle[fontStyle],
        textColor[color]
    ]);

    const As = as;
    return (
        <As className={cn} style={style}>
            {children}
        </As>
    );
}
