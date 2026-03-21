import { fetcher } from '@/services/fetcher-get/fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionUtility } from 'ts-common-by-teru'

const mockFetch = vi.fn()

describe('fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const { createSome, createNone } = optionUtility

  it('returns ng when url is none', async () => {
    const result = await fetcher({
      url: createNone(),
      scheme: z.object({}),
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ng when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ng when schema validation fails', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ foo: 1 }),
    })

    const schema = z.object({ bar: z.string() })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ok when everything is fine', async () => {
    const body = { bar: 'hello' }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => body,
    })

    const schema = z.object({ bar: z.string() })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
    })

    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') {
      expect(result.value.kind).toBe('some')
      if (result.value.kind === 'some') {
        expect(result.value.value).toEqual(body)
      }
    }
  })
})
