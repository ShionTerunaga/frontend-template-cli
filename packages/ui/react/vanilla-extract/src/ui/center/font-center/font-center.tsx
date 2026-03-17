import { type CheckerProps } from "@/src/shared/types/object";
import { type ChildrenOnly } from "@/src/shared/types/react";
import { type CSSProperties } from "react";
import fontCenterBaseStyle from "./font-center.css";
import classMerger from "@/src/utils/class-merger";

interface Props extends ChildrenOnly {
    as?: Extract<
        React.ElementType,
        "p" | "span" | "div" | "section" | "article" | "main"
    >;
    className?: string;
    style?: Omit<CSSProperties, "center">;
}

export function FontCenter<T extends Props>(
    props: CheckerProps<T, Props, "fontCenter has not any props.">
) {
    const { as = "p", className, style, children } = props;

    const classNames = classMerger([fontCenterBaseStyle, className ?? ""]);

    const componentProps = {
        className: classNames,
        style,
        children
    };

    const Component = as;

    return <Component {...componentProps} />;
}
