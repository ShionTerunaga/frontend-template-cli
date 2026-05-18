import { resultUtility, type Result } from 'ts-utility-kit'
import type { RandomDogRes } from '../model/random-dog'
import { createFetcherError } from '@/shared/error/fetcher'
import { type Option, optionUtility } from 'ts-utility-kit'
import type { FetcherError } from '@/shared/error/fetcher'

export function parseScheme(
    scheme: RandomDogRes,
): Result<Option<RandomDogRes>, FetcherError> {
    const { createOk, createNg } = resultUtility
    const { createSome } = optionUtility

    if (scheme.status !== 'success') {
        return createNg(createFetcherError.returnParseError)
    }

    return createOk(createSome(scheme))
}
