import type { Option } from "ts-shared";

export interface APIView {
    id: string;
    name: string;
    alternateNames: Array<string>;
    species: string;
    gender: "male" | "female" | "";
    house: string;
    dateOfBirth: Option<string>;
    yearOfBirth: Option<number>;
    wizard: boolean;
    ancestry: string;
    eyeColour: string;
    hairColour: string;
    wand: {
        wood: string;
        core: string;
        length: Option<number>;
    };
    patronus: string;
    hogwartsStudent: boolean;
    hogwartsStaff: boolean;
    actor: string;
    alternateActors: Array<string>;
    alive: boolean;
    image: string;
}
