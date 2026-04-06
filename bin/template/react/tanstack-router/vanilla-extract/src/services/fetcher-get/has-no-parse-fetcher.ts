import * as v from 'valibot'
import { type Option } from 'ts-shared'
import { type Result } from 'ts-shared'
import { fetcher } from './fetcher'
import { type FetcherError } from '@/shared/error/fetcher'

export async function hasNoParseFetcher<T extends v.GenericSchema>({
    url,
    scheme,
    cache,
}: {
    url: Option<string>
    scheme: T
    cache?: RequestCache
}): Promise<Result<Option<v.InferOutput<T>>, FetcherError>> {
    return await fetcher<T>({
        url,
        scheme,
        cache,
    })
}
