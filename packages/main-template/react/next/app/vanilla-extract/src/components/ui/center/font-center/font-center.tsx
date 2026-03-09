import { CheckerProps } from "@/shared/types/object";
import { ChildrenOnly } from "@/shared/types/react";
import { CSSProperties } from "react";
import fontCenterBaseStyle from "./font-center.css";
import classMerger from "@/utils/class-merger";

interface Props extends ChildrenOnly {
    as?: Extract<
        React.ElementType,
        "p" | "span" | "div" | "section" | "article" | "main"
    >;
    className?: string;
    style?: Omit<CSSProperties, "center">;
}

function FontCenter<T extends Props>(
    props: CheckerProps<T, Props, "fontCenter has not any props.">
) {
    const { as = "p", className, style, children } = props;
    const classNames = classMerger([fontCenterBaseStyle, className ?? ""]);

    const Component = as;

    return (
        <Component className={classNames} style={style}>
            {children}
        </Component>
    );
}

export default FontCenter;
