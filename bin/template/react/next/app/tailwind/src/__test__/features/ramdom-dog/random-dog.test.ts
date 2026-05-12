import { getRandomDog } from "@/features/random-dog";
import { appConfig } from "@/shared/config/config";
import { optionUtility } from "ts-shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();

describe("random-dog", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.stubGlobal("fetch", mockFetch);
    });

    const { createSome, createNone } = optionUtility;

    it("APIのURLを設定していない場合", async () => {
        vi.spyOn(appConfig, "apiKey2", "get").mockReturnValue(createNone());

        const result = await getRandomDog();

        expect(result.kind).toBe("ng");

        if (result.kind === "ok") {
            throw new Error("Unexpected ok result");
        }

        expect(result.err.status).toBe(4040);
        expect(result.err.message).toBe("APIのURLが設定されていません");
    });

    it("レスポンスがerrorの場合", async () => {
        vi.spyOn(appConfig, "apiKey2", "get").mockReturnValue(
            createSome("https://mock-api.com/random-dog")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 500, //statusコードは存在するものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getRandomDog();

        expect(result.kind).toBe("ng");
        if (result.kind === "ok") {
            throw new Error("Unexpected ok result");
        }

        expect(result.err.status).toBe(5001);
        expect(result.err.message).toBe("サーバーエラーです");
    });

    it("レスポンスがerrorでstatusコードが設定していないものが来た場合", async () => {
        vi.spyOn(appConfig, "apiKey2", "get").mockReturnValue(
            createSome("https://mock-api.com/random-dog")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 300, //statusコードは存在しないものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getRandomDog();

        expect(result.kind).toBe("ng");
        if (result.kind === "ok") {
            throw new Error("Unexpected ok result");
        }

        expect(result.err.status).toBe(9999);
        expect(result.err.message).toBe("不明なエラーが発生しました");
    });

    it("レスポンスのスキーマが違う場合", async () => {
        vi.spyOn(appConfig, "apiKey2", "get").mockReturnValue(
            createSome("https://mock-api.com/random-dog")
        );

        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                message: "http://hogehoge", //本来stringであるべきところをnumberにしている
                status: "success",
                extraField: "extra"
            })
        });

        const result = await getRandomDog();

        expect(result.kind).toBe("ng");
        if (result.kind === "ok") {
            throw new Error("Unexpected ok result");
        }

        expect(result.err.status).toBe(5000);
        expect(result.err.message).toBe("スキームエラーが発生しました");
    });
});
