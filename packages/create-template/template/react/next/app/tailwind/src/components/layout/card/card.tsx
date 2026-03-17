import { CheckerProps } from "@/shared/types/object";
import Image, { StaticImageData } from "next/image";
import { CSSProperties } from "react";
import { Box } from "@/components/ui";
import classMerger from "@/utils/class-merger";

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
            className={classMerger([
                "m-[0.8rem]",
                "overflow-hidden",
                "rounded-[18px]",
                "border",
                "border-[#dbe1ea]",
                "bg-white/[0.92]",
                "text-center",
                "shadow-[0_12px_28px_rgba(15,23,42,0.12)]",
                "backdrop-blur-[6px]",
                "transition-[transform,box-shadow,border-color]",
                "duration-200",
                "ease-in",
                "hover:-translate-y-1",
                "hover:border-[#93c5fd]",
                "hover:shadow-[0_20px_36px_rgba(30,64,175,0.22)]"
            ])}
            style={cardStyle}
        >
            <Image
                src={src}
                alt={alt}
                className={classMerger([
                    "w-full",
                    "border-b",
                    "border-b-slate-200",
                    "object-cover"
                ])}
                style={{ height: srcHeight }}
                width={srcWidth}
                height={srcHeight}
            />
            <p
                className={classMerger([
                    "m-0",
                    "p-[0.9rem]",
                    "text-[1rem]",
                    "font-bold",
                    "leading-[1.35]",
                    "text-slate-900"
                ])}
            >
                {title}
            </p>
        </Box>
    );
}
