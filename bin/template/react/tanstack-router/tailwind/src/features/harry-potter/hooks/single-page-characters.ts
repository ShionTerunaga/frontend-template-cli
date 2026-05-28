import { useEffect, useMemo, useState } from 'react'
import { getCharacter } from '../service/get-character'
import { createNone, createSome, isNone, type Option } from 'ts-utility-kit/option'
import type { APIView } from '../model/model-view'
import type { SinglePageGetCharacters } from './characters.type'
import { isErr } from 'ts-utility-kit/result'
import { type FetcherError } from '@/shared/error/fetcher'

export function useSinglePageCharacters() {
    const [fetchCharacter, setFetchCharacter] =
        useState<Option<Array<APIView>>>(createNone())

    const [error, setError] = useState<Option<FetcherError>>(createNone())

    useEffect(() => {
        let isMounted = true

        ;(async () => {
            const result = await getCharacter()

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!isMounted) return

            if (isErr(result)) {
                setError(createSome(result.err))
                return
            }

            if (isNone(result.value)) {
                return
            }

            setFetchCharacter(createSome(result.value.value))
        })()

        return () => {
            isMounted = false
        }
    }, [])

    const isLoading: boolean = useMemo(() => {
        return isNone(fetchCharacter) && isNone(error)
    }, [fetchCharacter, error])

    const characters: Array<SinglePageGetCharacters> = useMemo(() => {
        if (isNone(fetchCharacter)) {
            return []
        }

        const mappedCharacters: Array<SinglePageGetCharacters> =
            fetchCharacter.value.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image,
            }))

        return mappedCharacters
    }, [fetchCharacter])

    return {
        isLoading,
        characters,
        error,
    }
}
