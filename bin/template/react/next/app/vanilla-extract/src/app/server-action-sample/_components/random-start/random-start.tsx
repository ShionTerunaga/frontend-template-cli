"use client";

import { Box } from "@/lib/ui";
import { ja } from "@/shared/lang/ja";
import { isSome } from "ts-utility-kit/option";
import Image from "next/image";
import randomStartStyle from "./random-start.css";
import { useRandomStart } from "./random-start.logig";

function RandomStart() {
    const { dog, error, handleClick } = useRandomStart();

    return (
        <Box as="section" className={randomStartStyle.root}>
            <Box className={randomStartStyle.preview}>
                {error ? (
                    <p className={randomStartStyle.errorText}>
                        {ja.app.serverActionSample.error}
                    </p>
                ) : isSome(dog) ? (
                    <Image
                        src={dog.value.message}
                        width={150}
                        height={100}
                        className={randomStartStyle.image}
                        alt=""
                    />
                ) : null}
            </Box>
            <button className={randomStartStyle.button} onClick={handleClick}>
                {ja.app.serverActionSample.button}
            </button>
        </Box>
    );
}

export default RandomStart;
