"use client";

import { Box } from "@/components/ui";
import { getRandomDog } from "@/features/random-dog";
import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { ja } from "@/shared/lang/ja";
import { createNone, isNone, isSome, Option } from 'ts-utility-kit/option'
import Image from "next/image";
import { useState } from "react";
import randomStartStyle from "./random-start.css";
import { isOk } from 'ts-utility-kit/result'

function RandomStart() {
    const [dog, setDog] = useState<Option<RandomDogRes>>(() => createNone());
    const [error, setError] = useState<boolean>(false);

    const handleClick = async () => {
        if (error) {
            setError(false);
        }

        if (isSome(dog)) {
            setDog(createNone());
        }

        const res = await getRandomDog();

        if (isOk(res) && isSome(res.value)) {
            setDog(res.value);
        } else if (isOk(res) && isNone(res.value)) {
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
