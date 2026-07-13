import { hasNoParseFetcher } from '@/services/fetcher-get';
import { createSome, isSome } from 'ts-utility-kit/option';
import { isErr, isOk } from 'ts-utility-kit/result';
import * as v from 'valibot';
import { beforeEach, describe, it, vi, assert, expect } from 'vitest';

const mockFetch = vi.fn();

describe('hasNoParseFetcher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', mockFetch);
    });

    it('returns ng when schema mismatch', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ x: 1 }),
        });

        const schema = v.object({ y: v.string() });

        const result = await hasNoParseFetcher({
            url: createSome('https://example.com'),
            scheme: schema,
        });

        assert(isErr(result));

        expect(result.err.type).toBe('fetcherError');
    });

    it('returns ok when matches', async () => {
        const payload = { y: 'ok' };
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => payload,
        });

        const schema = v.object({ y: v.string() });

        const result = await hasNoParseFetcher({
            url: createSome('https://example.com'),
            scheme: schema,
        });

        assert(isOk(result));

        assert(isSome(result.value));

        expect(result.value.value).toEqual(payload);
    });
});
