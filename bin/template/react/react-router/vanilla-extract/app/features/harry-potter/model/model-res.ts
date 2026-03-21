import z from "zod";

export const APIScheme = z.array(
    z
        .object({
            id: z.string(),
            name: z.string(),
            alternate_names: z.array(z.string()),
            species: z.string(),
            gender: z.enum(["male", "female", ""]),
            house: z.string(),
            dateOfBirth: z.string().nullable(),
            yearOfBirth: z.number().nullable(),
            wizard: z.boolean(),
            ancestry: z.string(),
            eyeColour: z.string(),
            hairColour: z.string(),
            wand: z.object({
                wood: z.string(),
                core: z.string(),
                length: z.number().nullable()
            }),
            patronus: z.string(),
            hogwartsStudent: z.boolean(),
            hogwartsStaff: z.boolean(),
            actor: z.string(),
            alternate_actors: z.array(z.string()),
            alive: z.boolean(),
            image: z.string()
        })
        .strict()
);

export type APIRes = z.infer<typeof APIScheme>;
