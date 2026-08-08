"use client";

import { getRandomDog } from "@/features/random-dog";
import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { useState } from "react";
import { type Option, createNone, isNone, isSome } from "ts-utility-kit/option";
import { isOk } from "ts-utility-kit/result";

export function useRandomStart() {
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

    return {
        dog,
        error,
        handleClick
    };
}
