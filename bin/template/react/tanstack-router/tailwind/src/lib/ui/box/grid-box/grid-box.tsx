import { classMerger } from 'ts-utility-kit/merger';
import { Box } from '../main/box';
import { gridBoxBaseStyles, gridBoxGap, gridBoxGridTemplate } from './grid-box.style';
import type { ChildrenOnly } from '@/shared/types/react';
import type { CheckerProps } from '@/shared/types/object';

interface Props extends ChildrenOnly {
    gap?: keyof typeof gridBoxGap;
    gridTemplateColumns?: keyof typeof gridBoxGridTemplate;
}

export function GridBox<T extends Props>(props: CheckerProps<T, Props, 'type error'>) {
    const { children, gap = 'large', gridTemplateColumns = 'three' } = props;

    const className: string = classMerger([
        gridBoxBaseStyles,
        gridBoxGap[gap],
        gridBoxGridTemplate[gridTemplateColumns],
    ]);

    const componentProps = {
        className,
        children,
    };

    return <Box {...componentProps} />;
}
