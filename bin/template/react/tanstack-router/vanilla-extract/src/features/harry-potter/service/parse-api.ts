import { resultUtility, type Result } from 'ts-common-by-teru'
import type { APIView } from '../model/model-view'
import { type Option, optionUtility } from 'ts-common-by-teru'
import { isNull } from 'ts-common-by-teru'
import type { FetcherError } from '@/shared/error/fetcher'
import type { APIRes } from '../model/model-res'

export function parseApi(
    api: APIRes,
): Result<Option<Array<APIView>>, FetcherError> {
    const { createOk } = resultUtility
    const { createNone, createSome } = optionUtility
    const filterList: Array<APIView> = api
        .filter((item) => item.image !== '')
        .map((item) => {
            const {
                alternate_names,
                alternate_actors,
                dateOfBirth,
                yearOfBirth,
                wand,
                ...rest
            } = item

            const value: APIView = {
                ...rest,
                alternateNames: alternate_names,
                alternateActors: alternate_actors,
                dateOfBirth: isNull(dateOfBirth)
                    ? createNone()
                    : createSome(dateOfBirth),
                yearOfBirth: isNull(yearOfBirth)
                    ? createNone()
                    : createSome(yearOfBirth),
                wand: {
                    wood: wand.wood,
                    core: wand.core,
                    length: isNull(wand.length)
                        ? createNone()
                        : createSome(wand.length),
                },
            }

            return value
        })

    return createOk(createSome(filterList))
}
