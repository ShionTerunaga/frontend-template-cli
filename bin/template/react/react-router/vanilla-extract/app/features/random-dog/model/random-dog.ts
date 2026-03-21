import z from "zod";

export const randomDogScheme = z
    .object({
        message: z.string(),
        status: z.string()
    })
    .strict();

export type RandomDogRes = z.infer<typeof randomDogScheme>;
