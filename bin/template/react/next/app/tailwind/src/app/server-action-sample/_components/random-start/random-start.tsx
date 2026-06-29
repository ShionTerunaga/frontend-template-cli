"use client";

import { Box } from "@/lib/ui";
import { ja } from "@/shared/lang/ja";
import Image from "next/image";
import { isSome } from "ts-utility-kit/option";
import { classMerger } from "ts-utility-kit/merger";
import { useRandomStart } from "./random-start.logig";

function RandomStart() {
    const { dog, error, handleClick } = useRandomStart();

    return (
        <Box
            as="section"
            className={classMerger([
                "mx-auto",
                "mt-6",
                "max-w-[540px]",
                "rounded-2xl",
                "border",
                "border-[#dbe1ea]",
                "bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]",
                "p-5",
                "shadow-[0_10px_28px_rgba(15,23,42,0.1)]"
            ])}
        >
            <Box
                className={classMerger([
                    "mb-4",
                    "grid",
                    "min-h-[140px]",
                    "place-items-center",
                    "rounded-xl",
                    "border",
                    "border-dashed",
                    "border-slate-300",
                    "bg-slate-100"
                ])}
            >
                {error ? (
                    <p
                        className={classMerger([
                            "font-semibold",
                            "text-red-700"
                        ])}
                    >
                        {ja.app.serverActionSample.error}
                    </p>
                ) : isSome(dog) ? (
                    <Image
                        src={dog.value.message}
                        width={150}
                        height={100}
                        className={classMerger([
                            "rounded-[10px]",
                            "border",
                            "border-slate-200"
                        ])}
                        alt=""
                    />
                ) : null}
            </Box>
            <button
                className={classMerger([
                    "inline-flex",
                    "items-center",
                    "justify-center",
                    "cursor-pointer",
                    "rounded-full",
                    "border-0",
                    "bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_100%)]",
                    "px-4",
                    "py-2.5",
                    "text-[0.95rem]",
                    "font-bold",
                    "text-white",
                    "transition-[transform,box-shadow,opacity]",
                    "duration-200",
                    "ease-in",
                    "hover:-translate-y-px",
                    "hover:shadow-[0_10px_20px_rgba(37,99,235,0.35)]",
                    "active:translate-y-0",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-60"
                ])}
                onClick={handleClick}
            >
                {ja.app.serverActionSample.button}
            </button>
        </Box>
    );
}

export default RandomStart;
