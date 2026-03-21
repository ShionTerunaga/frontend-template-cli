import { CheckerProps } from "@/shared/types/object";
import Image, { StaticImageData } from "next/image";
import { CSSProperties } from "react";
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

    // Integrate dynamic width/height via inline style (optional: could be arbitrary Tailwind classes)
    const cardStyle: CSSProperties = { width: srcWidth, height: boxHeight };

    return (
        <Box
            className="border border-[#cccccc] rounded-[10px] overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center m-[20px]"
            style={cardStyle}
        >
            <Image
                src={src}
                alt={alt}
                className="object-cover w-full"
                width={srcWidth}
                height={srcHeight}
            />
            <p className="p-4 text-[1.2rem] font-bold text-[#333333] m-0">
                {title}
            </p>
        </Box>
    );
}
