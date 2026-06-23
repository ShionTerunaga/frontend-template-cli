import { hasNoParseFetcher } from '@/services/fetcher-get/has-no-parse-fetcher';
import { createSome, isSome } from 'ts-utility-kit/option';
import { isErr, isOk } from 'ts-utility-kit/result';
import * as v from 'valibot';
import { beforeEach, describe, expect, it, vi, assert } from 'vitest';

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

        expect(isErr(result)).toBeTruthy();
        assert(isErr(result));
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

        expect(isOk(result)).toBeTruthy();
        assert(isOk(result));

        expect(isSome(result.value)).toBeTruthy();
    });
});
