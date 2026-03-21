import type { CheckerProps } from "@/shared/types/object";
import { headingFontStyle } from "./heading.css";
import { textColor, type TextTheme } from "@/shared/theme/design-system.css";
import type { ChildrenOnly } from "@/shared/types/react";
import type { ElementType } from "react";
import classMerger from "@/utils/class-merger";

/**
 * HeadingFont type
 */
export type HeadingFont = keyof typeof headingFontStyle;

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

    const Components = as;

    const componentProps = {
        className: cn,
        style,
        children
    };

    return <Components {...componentProps} />;
}
