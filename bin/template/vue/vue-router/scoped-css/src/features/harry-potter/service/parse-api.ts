import { resultUtility, type Result } from 'ts-shared'
import type { APIRes } from '../model/model-res'
import type { APIView } from '../model/model-view'
import { optionUtility, type Option } from 'ts-shared'
import type { FetcherError } from '@/shared/error/fetcher'

export function parseApi(api: APIRes): Result<Option<Array<APIView>>, FetcherError> {
  const { createOk } = resultUtility
  const { optionConversion, createSome } = optionUtility

  const filterList: Array<APIView> = api
    .filter((item) => item.image !== '')
    .map((item) => {
      const { alternate_names, alternate_actors, dateOfBirth, yearOfBirth, wand, ...rest } = item

      const value: APIView = {
        ...rest,
        alternateNames: alternate_names,
        alternateActors: alternate_actors,
        dateOfBirth: optionConversion(dateOfBirth),
        yearOfBirth: optionConversion(yearOfBirth),
        wand: {
          wood: wand.wood,
          core: wand.core,
          length: optionConversion(wand.length),
        },
      }

      return value
    })

  return createOk(createSome(filterList))
}
