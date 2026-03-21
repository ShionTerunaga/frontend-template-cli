import { createHttpScheme, type HttpCustomStatus } from './http-scheme'
import type { CustomError } from '../core/core-error'

export interface HttpError extends CustomError {
    status: HttpCustomStatus
}

/**ここは仕様に応じて変更する*/
export const createHttpError = (function () {
    const httpErrorScheme = createHttpScheme

    const createHttpError = ({
        status,
        message,
    }: {
        status: HttpCustomStatus
        message: string
    }): HttpError => {
        return {
            type: 'httpError',
            status,
            message,
        }
    }

    const returnNotFoundAPIUrl = (function () {
        return createHttpError({
            status: httpErrorScheme.httpCustomStatusScheme.returnNotFoundAPIUrl,
            message: httpErrorScheme.httpErrorMessage.returnNotFoundAPIUrl,
        })
    })()

    const returnNoPermission = (function () {
        return createHttpError({
            status: httpErrorScheme.httpCustomStatusScheme.returnNoPermission,
            message: httpErrorScheme.httpErrorMessage.returnNoPermission,
        })
    })()

    const returnBadRequest = (function () {
        return createHttpError({
            status: httpErrorScheme.httpCustomStatusScheme.returnBadRequest,
            message: httpErrorScheme.httpErrorMessage.returnBadRequest,
        })
    })()

    const returnInternalServerError = (function () {
        return createHttpError({
            status: httpErrorScheme.httpCustomStatusScheme
                .returnInternalServerError,
            message: httpErrorScheme.httpErrorMessage.returnInternalServerError,
        })
    })()

    return {
        returnInternalServerError,
        returnNotFoundAPIUrl,
        returnNoPermission,
        returnBadRequest,
    }
})()
