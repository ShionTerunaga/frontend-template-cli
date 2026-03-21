import type { ChildrenOnly } from "@/src/shared/types/react";
import {
    gridBoxBaseStyles,
    gridBoxGap,
    gridBoxGridTemplate
} from "./grid-box.css";
import type { CheckerProps } from "@/src/shared/types/object";
import { Box } from "../main/box";
import classMerger from "@/src/utils/class-merger";

interface Props extends ChildrenOnly {
    gap?: keyof typeof gridBoxGap;
    gridTemplateColumns?: keyof typeof gridBoxGridTemplate;
}

export function GridBox<T extends Props>(
    props: CheckerProps<T, Props, "type error">
) {
    const { children, gap = "large", gridTemplateColumns = "three" } = props;

    const className: string = classMerger([
        gridBoxGap[gap],
        gridBoxGridTemplate[gridTemplateColumns],
        gridBoxBaseStyles
    ]);

    const componentProps = {
        className,
        children
    };

    return <Box {...componentProps} />;
}
