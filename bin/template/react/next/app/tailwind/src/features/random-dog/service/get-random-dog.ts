"use server";

import { appConfig } from "@/shared/config/config";
import { Result } from "ts-shared";
import { RandomDogRes, randomDogScheme } from "../model/random-dog";
import { parseScheme } from "./parse-scheme";
import { hasParseFetcher } from "@/services/fetcher-get";
import { Option } from "ts-shared";
import { FetcherError } from "@/shared/error/fetcher";

export async function getRandomDog(): Promise<
    Result<Option<RandomDogRes>, FetcherError>
> {
    return await hasParseFetcher({
        url: appConfig.apiKey2,
        scheme: randomDogScheme,
        parse: parseScheme,
        cache: "no-store"
    });
}
