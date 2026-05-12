import type { CustomError } from '../core/core-error'
import { createHttpError, type HttpError } from '../http/http'
import { fetcherErrorScheme, type FetcherStatus } from './fetcher-scheme'

interface FetcherBaseError extends CustomError {
  status: FetcherStatus
}

export type FetcherError = FetcherBaseError | HttpError

export const createFetcherError = (function () {
  const { returnBadRequest, returnNoPermission, returnNotFoundAPIUrl, returnInternalServerError } =
    createHttpError
  const { fetchErrorMessage, fetcherErrorStatusScheme, httpErrorStatusResponse } =
    fetcherErrorScheme

  const createFetcher = ({
    status,
    errorMessage,
  }: {
    status: FetcherStatus
    errorMessage: string
  }): FetcherError => {
    return {
      type: 'fetcherError',
      status,
      message: errorMessage,
    }
  }

  const returnNotSetApiUrl = (function () {
    return createFetcher({
      status: fetcherErrorStatusScheme.returnNotSetAPIUrl,
      errorMessage: fetchErrorMessage.returnNotSetAPIUrl,
    })
  })()
  const returnSchemeError = (function () {
    return createFetcher({
      status: fetcherErrorStatusScheme.returnSchemeError,
      errorMessage: fetchErrorMessage.returnSchemeError,
    })
  })()

  const returnParseError = (function () {
    return createFetcher({
      status: fetcherErrorStatusScheme.returnParseError,
      errorMessage: fetchErrorMessage.returnParseError,
    })
  })()

  const returnFetchFunctionError = (function () {
    return createFetcher({
      status: fetcherErrorStatusScheme.returnFetchFunctionError,
      errorMessage: fetchErrorMessage.returnFetchFunctionError,
    })
  })()

  const returnUnknownError = (function () {
    return createFetcher({
      status: fetcherErrorStatusScheme.returnUnknownError,
      errorMessage: fetchErrorMessage.returnUnknownError,
    })
  })()

  return {
    httpErrorStatusResponse,
    returnNoPermission,
    returnNotFoundAPIUrl,
    returnBadRequest,
    returnUnknownError,
    returnNotSetApiUrl,
    returnSchemeError,
    returnParseError,
    returnFetchFunctionError,
    returnInternalServerError,
  }
})()
