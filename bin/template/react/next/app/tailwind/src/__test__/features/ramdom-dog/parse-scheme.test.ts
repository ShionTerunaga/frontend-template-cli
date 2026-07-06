import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { parseScheme } from "@/features/random-dog/service/parse-scheme";
import { isErr, isOk } from "ts-utility-kit/result";
import { isSome } from "ts-utility-kit/option";
import { assert, describe, expect, it } from "vitest";

describe("parseScheme", () => {
    it("statusがsuccessではなかった時", () => {
        const sample: RandomDogRes = {
            message:
                "https://images.dog.ceo/breeds/hound-walker/n02089867_3484.jpg",
            status: "error"
        };

        const res = parseScheme(sample);

        expect(isErr(res)).toBeTruthy();
        assert(isErr(res));

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

        expect(isOk(res)).toBeTruthy();
        assert(isOk(res));

        expect(isSome(res.value)).toBeTruthy();
        assert(isSome(res.value));

        expect(res.value.value).toEqual(sample);
    });
});
