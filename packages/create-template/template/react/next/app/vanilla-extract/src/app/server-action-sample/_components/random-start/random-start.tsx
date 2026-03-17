"use client";

import { Box } from "@/components/ui";
import { getRandomDog } from "@/features/random-dog";
import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { ja } from "@/shared/lang/ja";
import { Option, optionUtility } from "@/utils/option";
import Image from "next/image";
import { useState } from "react";
import randomStartStyle from "./random-start.css";

function RandomStart() {
    const { createNone } = optionUtility;

    const [dog, setDog] = useState<Option<RandomDogRes>>(() => createNone());
    const [error, setError] = useState<boolean>(false);

    const handleClick = async () => {
        if (error) {
            setError(false);
        }

        if (dog.isSome) {
            setDog(createNone());
        }

        const res = await getRandomDog();

        if (res.isOk && res.value.isSome) {
            setDog(res.value);
        } else if (res.isOk && res.value.isNone) {
            setDog(createNone());
        } else {
            setError(true);
        }
    };

    return (
        <Box as="section" className={randomStartStyle.root}>
            <Box className={randomStartStyle.preview}>
                {error ? (
                    <p className={randomStartStyle.errorText}>
                        {ja.app.serverActionSample.error}
                    </p>
                ) : dog.isSome ? (
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
