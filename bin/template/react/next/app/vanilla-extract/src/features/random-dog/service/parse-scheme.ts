import { resultUtility, Result } from "ts-utility-kit";
import { RandomDogRes } from "../model/random-dog";
import { createFetcherError } from "@/shared/error/fetcher";
import { Option, optionUtility } from "ts-utility-kit";
import { FetcherError } from "@/shared/error/fetcher";

export function parseScheme(
    scheme: RandomDogRes
): Result<Option<RandomDogRes>, FetcherError> {
    const { createOk, createNg } = resultUtility;
    const { createSome } = optionUtility;

    if (scheme.status !== "success") {
        return createNg(createFetcherError.returnParseError);
    }

    return createOk(createSome(scheme));
}
