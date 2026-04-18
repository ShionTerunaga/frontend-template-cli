import { type CheckerProps } from "@/shared/types/object";
import { type ChildrenOnly } from "@/shared/types/react";
import { type CSSProperties } from "react";
import fontCenterBaseStyle from "./font-center.css";
import { classMerger } from "ts-shared";

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

    const Component = as;

    const componentProps = {
        className: classNames,
        style,
        children
    };

    return <Component {...componentProps} />;
}
