import * as v from 'valibot'

export const randomDogScheme = v.strictObject({
        message: v.string(),
        status: v.string(),
    })

export type RandomDogRes = v.InferOutput<typeof randomDogScheme>
