import { createHttpScheme } from '@/shared/error/http/http-scheme'
import { describe, expect, it } from 'vitest'

describe('http-scheme', () => {
    it('createHttpSchemeにおいてhttpErrorStatusResponseの正常な値が返ってくる', () => {
        const httpErrorScheme = createHttpScheme

        expect(httpErrorScheme.httpErrorStatusResponse.notFound).toEqual(404)
        expect(
            httpErrorScheme.httpErrorStatusResponse.internalServerError,
        ).toEqual(500)
        expect(httpErrorScheme.httpErrorStatusResponse.badRequest).toEqual(400)
        expect(httpErrorScheme.httpErrorStatusResponse.forbidden).toEqual(403)
    })

    it('createHttpSchemeにおいてhttpCustomStatusScheme', () => {
        const httpErrorScheme = createHttpScheme

        expect(
            httpErrorScheme.httpCustomStatusScheme.returnNotFoundAPIUrl,
        ).toEqual(4041)
        expect(
            httpErrorScheme.httpCustomStatusScheme.returnNoPermission,
        ).toEqual(4031)
        expect(httpErrorScheme.httpCustomStatusScheme.returnBadRequest).toEqual(
            4001,
        )
    })

    it('createHttpSchemeにおいてerrorMessage', () => {
        const httpErrorScheme = createHttpScheme

        expect(httpErrorScheme.httpErrorMessage.returnNotFoundAPIUrl).toEqual(
            'APIのURLが見つかりません',
        )
        expect(httpErrorScheme.httpErrorMessage.returnNoPermission).toEqual(
            '権限がありません',
        )
        expect(httpErrorScheme.httpErrorMessage.returnBadRequest).toEqual(
            '不正なリクエストです',
        )

        expect(
            httpErrorScheme.httpErrorMessage.returnInternalServerError,
        ).toEqual('サーバーエラーです')
    })
})
