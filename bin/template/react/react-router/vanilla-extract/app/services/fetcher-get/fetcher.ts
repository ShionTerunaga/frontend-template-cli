import * as v from 'valibot'
import { type Option, optionUtility } from 'ts-shared'
import { type Result, resultUtility } from 'ts-shared'
import { createHttpScheme } from '@/shared/error/http'
import {
    createFetcherError,
    type FetcherError,
} from '@/shared/error/fetcher/fetcher-error'

export async function fetcher<T extends v.GenericSchema>({
    url,
    scheme,
    cache,
}: {
    url: Option<string>
    scheme: T
    cache?: RequestCache
}): Promise<Result<Option<v.InferOutput<T>>, FetcherError>> {
    const { notFound, forbidden, badRequest, internalServerError } =
        createHttpScheme.httpErrorStatusResponse

    const {
        returnNotSetApiUrl,
        returnNotFoundAPIUrl,
        returnNoPermission,
        returnBadRequest,
        returnSchemeError,
        returnUnknownError,
        returnFetchFunctionError,
        returnInternalServerError,
    } = createFetcherError

    const { createNone, createSome } = optionUtility
    const { createNg, createOk, checkPromiseReturn } = resultUtility

    if (url.isNone) {
        return createNg(returnNotSetApiUrl)
    }

    const res = await checkPromiseReturn({
        fn: () => fetch(url.value, { cache }),
        err: (e) => {
            console.error(e)
            return createNg(returnFetchFunctionError)
        },
    })

    if (res.isErr) {
        return res
    }

    if (!res.value.ok) {
        const status = res.value.status

        switch (status) {
            case notFound:
                return createNg(returnNotFoundAPIUrl)
            case forbidden:
                return createNg(returnNoPermission)
            case badRequest:
                return createNg(returnBadRequest)
            case internalServerError:
                return createNg(returnInternalServerError)
            default:
                return createNg(returnUnknownError)
        }
    }

    const resValue = await res.value.json()

    const judgeType = v.safeParse(scheme, resValue)

    if (!judgeType.success) {
        return createNg(returnSchemeError)
    }

    const okValue = judgeType.output

    if (okValue === undefined || okValue === null) {
        return createOk(createNone())
    }

    return createOk(createSome(okValue))
}
