import { createErr, createOk, type Result } from 'ts-utility-kit/result'
import type { RandomDogRes } from '../model/random-dog'
import { createFetcherError } from '@/shared/error/fetcher'
import { createSome, type Option } from 'ts-utility-kit/option'
import type { FetcherError } from '@/shared/error/fetcher'

export function parseScheme(
    scheme: RandomDogRes,
): Result<Option<RandomDogRes>, FetcherError> {

    if (scheme.status !== 'success') {
        return createErr(createFetcherError.returnParseError)
    }

    return createOk(createSome(scheme))
}
