import * as v from 'valibot'

export const APIScheme = v.array(
    v.strictObject({
      id: v.string(),
      name: v.string(),
      alternate_names: v.array(v.string()),
      species: v.string(),
      gender: v.union([v.literal('male'), v.literal('female'), v.literal('')]),
      house: v.string(),
      dateOfBirth: v.nullable(v.string()),
      yearOfBirth: v.nullable(v.number()),
      wizard: v.boolean(),
      ancestry: v.string(),
      eyeColour: v.string(),
      hairColour: v.string(),
      wand: v.object({
        wood: v.string(),
        core: v.string(),
        length: v.nullable(v.number()),
      }),
      patronus: v.string(),
      hogwartsStudent: v.boolean(),
      hogwartsStaff: v.boolean(),
      actor: v.string(),
      alternate_actors: v.array(v.string()),
      alive: v.boolean(),
      image: v.string(),
    })

)

export type APIRes = v.InferOutput<typeof APIScheme>
