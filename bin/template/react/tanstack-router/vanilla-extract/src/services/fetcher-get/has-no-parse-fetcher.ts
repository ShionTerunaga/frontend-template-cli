import z from 'zod'
import { type Option } from 'ts-common-by-teru'
import { type Result } from 'ts-common-by-teru'
import { fetcher } from './fetcher'
import { type FetcherError } from '@/shared/error/fetcher'

export async function hasNoParseFetcher<T extends z.ZodType>({
    url,
    scheme,
    cache,
}: {
    url: Option<string>
    scheme: T
    cache?: RequestCache
}): Promise<Result<Option<z.infer<T>>, FetcherError>> {
    return await fetcher<T>({
        url,
        scheme,
        cache,
    })
}
