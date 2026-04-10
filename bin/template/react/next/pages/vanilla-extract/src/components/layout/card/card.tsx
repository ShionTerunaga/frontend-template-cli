import { CheckerProps } from "@/shared/types/object";
import Image, { StaticImageData } from "next/image";
import { CSSProperties } from "react";
import cardStyles from "./card.css";
import { Box } from "@/components/ui";

interface Props {
    key: number | string;
    title: string;
    src: StaticImageData | string;
    alt: string;
    boxHeight: number;
    srcWidth: number;
    srcHeight: number;
}

export function Card<T extends Props>(
    props: CheckerProps<T, Props, "different card props">
) {
    const { title, src, alt, srcWidth, srcHeight, boxHeight } = props;

    const cardStyle: CSSProperties = {
        width: srcWidth,
        height: boxHeight
    };

    return (
        <Box className={cardStyles.cardContainer} style={cardStyle}>
            <Image
                src={src}
                alt={alt}
                className={cardStyles.image}
                width={srcWidth}
                height={srcHeight}
            />
            <p className={cardStyles.title}>{title}</p>
        </Box>
    );
}
