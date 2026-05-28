import * as v from "valibot";
import { isErr, checkPromiseReturn, createErr, createOk, Result } from 'ts-utility-kit/result'
import { createNone, createSome, isNone, Option } from 'ts-utility-kit/option'
import { createHttpScheme } from "@/shared/error/http";
import {
    createFetcherError,
    FetcherError
} from "@/shared/error/fetcher/fetcher-error";

export async function fetcher<T extends v.GenericSchema>({
    url,
    scheme,
    cache
}: {
    url: Option<string>;
    scheme: T;
    cache?: RequestCache;
}): Promise<Result<Option<v.InferOutput<T>>, FetcherError>> {
    const { notFound, forbidden, badRequest, internalServerError } =
        createHttpScheme.httpErrorStatusResponse;

    const {
        returnNotSetApiUrl,
        returnNotFoundAPIUrl,
        returnNoPermission,
        returnBadRequest,
        returnSchemeError,
        returnUnknownError,
        returnFetchFunctionError,
        returnInternalServerError
    } = createFetcherError;

    if (isNone(url)) {
        return createErr(returnNotSetApiUrl);
    }

    const res = await checkPromiseReturn({
        fn: () => fetch(url.value, { cache }),
        err: (e) => {
            console.error(e);
            return createErr(returnFetchFunctionError);
        }
    });

    if (isErr(res)) {
        return res;
    }

    if (!res.value.ok) {
        const status = res.value.status;

        switch (status) {
            case notFound:
                return createErr(returnNotFoundAPIUrl);
            case forbidden:
                return createErr(returnNoPermission);
            case badRequest:
                return createErr(returnBadRequest);
            case internalServerError:
                return createErr(returnInternalServerError);
            default:
                return createErr(returnUnknownError);
        }
    }

    const resValue = await res.value.json();

    const judgeType = v.safeParse(scheme, resValue);

    if (!judgeType.success) {
        return createErr(returnSchemeError);
    }

    const okValue = judgeType.output;

    if (okValue === undefined || okValue === null) {
        return createOk(createNone());
    }

    return createOk(createSome(okValue));
}
