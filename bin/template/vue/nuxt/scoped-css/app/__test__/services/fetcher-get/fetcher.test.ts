import { fetcher } from "@/services/fetcher-get/fetcher";
import { createNone, createSome, isSome } from "ts-utility-kit/option";
import { isErr, isOk } from "ts-utility-kit/result";
import * as v from "valibot";
import { beforeEach, describe, expect, it, vi, assert } from "vitest";

const mockFetch = vi.fn();

describe("fetcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("fetch", mockFetch);
    });

    it("returns ng when url is none", async () => {
        const result = await fetcher({
            url: createNone(),
            scheme: v.object({})
        });

        expect(isErr(result)).toBeTruthy();
        assert(isErr(result));
    });

    it("returns ng when response is not ok", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({})
        });

        const result = await fetcher({
            url: createSome("https://example.com"),
            scheme: v.object({})
        });

        expect(isErr(result)).toBeTruthy();
        assert(isErr(result));
    });

    it("returns ng when schema validation fails", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ foo: 1 })
        });

        const schema = v.object({ bar: v.string() });

        const result = await fetcher({
            url: createSome("https://example.com"),
            scheme: schema
        });

        expect(isErr(result)).toBeTruthy();
        assert(isErr(result));
    });

    it("returns ok when everything is fine", async () => {
        const body = { bar: "hello" };
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => body
        });

        const schema = v.object({ bar: v.string() });

        const result = await fetcher({
            url: createSome("https://example.com"),
            scheme: schema
        });

        expect(isOk(result)).toBeTruthy();
        assert(isOk(result));

        expect(isSome(result.value)).toBeTruthy();

        assert(isSome(result.value));

        expect(result.value.value).toEqual(body);
    });
});
