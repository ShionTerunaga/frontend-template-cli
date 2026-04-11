import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { parseScheme } from "@/features/random-dog/service/parse-scheme";
import { describe, expect, it } from "vitest";

describe("parseScheme", () => {
    it("statusがsuccessではなかった時", () => {
        const sample: RandomDogRes = {
            message:
                "https://images.dog.ceo/breeds/hound-walker/n02089867_3484.jpg",
            status: "error"
        };

        const res = parseScheme(sample);

        expect(res.kind).toBe("ng");

        if (res.kind === "ok") {
            throw new Error("Unexpected ok result");
        }

        expect(res.err.status).toBe(8000);

        expect(res.err.message).toBe("データのパースに失敗しました");
    });

    it("statusがsuccessだったとき", () => {
        const sample: RandomDogRes = {
            message:
                "https://images.dog.ceo/breeds/hound-walker/n02089867_3484.jpg",
            status: "success"
        };

        const res = parseScheme(sample);

        expect(res.kind).toBe("ok");

        if (res.kind === "ng") {
            throw new Error("Unexpected ng result");
        }

        expect(res.value.kind).toBe("some");

        if (res.value.kind === "some") {
            expect(res.value.value).toEqual(sample);
        }
    });
});
