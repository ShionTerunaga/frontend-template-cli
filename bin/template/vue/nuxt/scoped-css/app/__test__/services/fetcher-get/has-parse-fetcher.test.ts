import { hasParseFetcher } from "@/services/fetcher-get";
import { createSome, isSome } from "ts-utility-kit/option";
import { createOk, isErr, isOk } from "ts-utility-kit/result";
import * as v from "valibot";
import { beforeEach, describe, expect, it, vi, assert } from "vitest";

const mockFetch = vi.fn();

describe("hasParseFetcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("fetch", mockFetch);
    });

    it("propagates ng from fetcher", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({})
        });

        const schema = v.object({});

        const result = await hasParseFetcher({
            url: createSome("https://example.com"),
            scheme: schema,
            parse: () => createOk(createSome("ok"))
        });

        assert(isErr(result));

        expect(result.err.type).toBe("httpError");
    });

    it("returns parse result when fetcher ok", async () => {
        const payload = { a: 1 };
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => payload
        });

        const schema = v.object({ a: v.number() });

        const result = await hasParseFetcher({
            url: createSome("https://example.com"),
            scheme: schema,
            parse: () => createOk(createSome("parsed"))
        });

        assert(isOk(result));

        assert(isSome(result.value));

        expect(result.value.value).toBe("parsed");
    });
});
