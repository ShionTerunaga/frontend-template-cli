import { describe, it, expect, vi, beforeEach } from "vitest";
import { optionUtility } from "ts-shared";
import { appConfig } from "@/shared/config/config";
import { APIRes, getCharacter } from "@/features/harry-potter";

const mockAPIData: APIRes = [
    {
        id: "1",
        name: "Harry Potter",
        alternate_names: [],
        species: "human",
        gender: "male",
        house: "Gryffindor",
        dateOfBirth: "31-07-1980",
        yearOfBirth: 1980,
        wizard: true,
        ancestry: "half-blood",
        eyeColour: "green",
        hairColour: "black",
        wand: {
            wood: "holly",
            core: "phoenix feather",
            length: 11
        },
        patronus: "stag",
        hogwartsStudent: true,
        hogwartsStaff: false,
        actor: "Daniel Radcliffe",
        alternate_actors: [],
        alive: true,
        image: "https://hp-api/image.jpg"
    }
];

const mockFetch = vi.fn();

describe("getCharacter", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.stubGlobal("fetch", mockFetch);
    });
    const { createSome, createNone } = optionUtility;

    it("APIのURLを設定していない場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(createNone());

        const result = await getCharacter();

        expect(result.kind).toBe("ng");

        if (result.kind === "ok") return;

        expect(result.err.status).toBe(4040);
        expect(result.err.message).toBe("APIのURLが設定されていません");
    });

    it("レスポンスがerrorの場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createSome("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 500, //statusコードは存在するものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getCharacter();

        expect(result.kind).toBe("ng");

        if (result.isOk) return;

        expect(result.err.status).toBe(5001);
        expect(result.err.message).toBe("サーバーエラーです");
    });

    it("レスポンスがerrorでstatusコードが設定していないものが来た場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createSome("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 300, //statusコードは存在しないものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getCharacter();

        expect(result.kind).toBe("ng");

        if (result.isOk) return;

        expect(result.err.status).toBe(9999);
        expect(result.err.message).toBe("不明なエラーが発生しました");
    });

    it("スキームが合わない場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createSome("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => [{ ...mockAPIData[0], wand: null }]
        });

        const result = await getCharacter();

        expect(result.kind).toBe("ng");

        if (result.isOk) return;
        expect(result.err.status).toBe(5000);
        expect(result.err.message).toBe("スキームエラーが発生しました");
    });

    it("should return parsed characters when valid data is provided", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createSome("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockAPIData
        });

        const result = await getCharacter();

        expect(result.kind).toBe("ok");

        if (result.kind !== "ok") {
            throw new Error("Result is not ok");
        }

        expect(result.value.kind).toBe("some");

        if (result.value.kind !== "some") {
            throw new Error("Option is not some");
        }

        expect(result.value.value.length).toBe(1);

        expect(result.value.value[0].name).toBe("Harry Potter");
    });
});
