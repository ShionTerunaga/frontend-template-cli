import { describe, it, expect } from "vitest";
import { optionUtility } from "ts-shared";
import { APIRes } from "@/features/harry-potter";
import { parseApi } from "@/features/harry-potter/service/parse-api";

const mockApiData: APIRes = [
    {
        id: "1",
        name: "Harry Potter",
        alternate_names: ["The Boy Who Lived"],
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
    },
    {
        id: "2",
        name: "Unknown Ghost",
        alternate_names: [],
        species: "ghost",
        gender: "",
        house: "",
        dateOfBirth: null,
        yearOfBirth: null,
        wizard: false,
        ancestry: "",
        eyeColour: "",
        hairColour: "",
        wand: {
            wood: "",
            core: "",
            length: null
        },
        patronus: "",
        hogwartsStudent: false,
        hogwartsStaff: false,
        actor: "",
        alternate_actors: [],
        alive: false,
        image: ""
    }
];

describe("perseApi", () => {
    const { createSome, createNone } = optionUtility;

    it("適したフォーマットが返ってくる", () => {
        const result = parseApi(mockApiData);

        expect(result.kind).toBe("ok");

        if (result.kind !== "ok") {
            throw new Error("Result is not ok");
        }

        expect(result.value.kind).toBe("some");

        if (result.value.kind !== "some") {
            throw new Error("Option is not some");
        }

        expect(result.value.value.length).toBe(1);

        const harry = result.value.value[0];

        expect(harry.name).toBe("Harry Potter");
        expect(harry.alternateNames).toEqual(["The Boy Who Lived"]);
        expect(harry.gender).toBe("male");
        expect(harry.dateOfBirth).toEqual(createSome("31-07-1980"));
        expect(harry.yearOfBirth).toEqual(createSome(1980));
        expect(harry.wand.length).toEqual(createSome(11));
    });

    it("nullをOptionに変換できているか", () => {
        const dataWithNulls: APIRes = [
            {
                ...mockApiData[0],
                dateOfBirth: null,
                yearOfBirth: null,
                wand: {
                    ...mockApiData[0].wand,
                    length: null
                },
                image: "https://someimage.jpg"
            }
        ];

        const result = parseApi(dataWithNulls);

        expect(result.kind).toBe("ok");

        if (result.kind !== "ok") {
            throw new Error("Result is not ok");
        }

        expect(result.value.kind).toBe("some");

        if (result.value.kind !== "some") {
            throw new Error("Option is not some");
        }

        expect(result.value.value.length).toBe(1);

        const character = result.value.value[0];

        expect(character.dateOfBirth).toEqual(createNone());
        expect(character.yearOfBirth).toEqual(createNone());
        expect(character.wand.length).toEqual(createNone());
    });

    it("imageが空文字の時は要素が省かれる", () => {
        const dataWithNoImages: APIRes = mockApiData.map((item) => ({
            ...item,
            image: ""
        }));

        const result = parseApi(dataWithNoImages);

        expect(result.kind).toBe("ok");

        if (result.kind !== "ok") {
            throw new Error("Result is not ok");
        }

        expect(result.value.kind).toBe("some");
    });
});
