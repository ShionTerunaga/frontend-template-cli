import { hasParseFetcher } from '@/services/fetcher-get/has-parse-fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionUtility } from 'ts-common-by-teru'
import { resultUtility } from 'ts-common-by-teru'

const mockFetch = vi.fn()

describe('hasParseFetcher', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', mockFetch)
    })

    const { createSome } = optionUtility
    const { createOk } = resultUtility

    it('propagates ng from fetcher', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        })

        const schema = z.object({})

        const result = await hasParseFetcher({
            url: createSome('https://example.com'),
            scheme: schema,
            parse: () => createOk(createSome('ok')),
        })

        expect(result.kind).toBe('ng')
    })

    it('returns parse result when fetcher ok', async () => {
        const payload = { a: 1 }
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => payload,
        })

        const schema = z.object({ a: z.number() })

        const result = await hasParseFetcher({
            url: createSome('https://example.com'),
            scheme: schema,
            parse: () => createOk(createSome('parsed')),
        })

        expect(result.kind).toBe('ok')
        if (result.kind === 'ok') expect(result.value.kind).toBe('some')
        if (result.kind === 'ok' && result.value.kind === 'some')
            expect(result.value.value).toBe('parsed')
    })
})
