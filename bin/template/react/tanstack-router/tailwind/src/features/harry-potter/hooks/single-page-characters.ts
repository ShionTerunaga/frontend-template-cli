import { useEffect, useMemo, useState } from 'react'
import { getCharacter } from '../service/get-character'
import type { Option } from 'ts-shared'
import type { APIView } from '../model/model-view'
import type { SinglePageGetCharacters } from './characters.type'
import { optionUtility } from 'ts-shared'
import { type FetcherError } from '@/shared/error/fetcher'

export function useSinglePageCharacters() {
    const { createNone, createSome } = optionUtility

    const [fetchCharacter, setFetchCharacter] =
        useState<Option<Array<APIView>>>(createNone())

    const [error, setError] = useState<Option<FetcherError>>(createNone())

    useEffect(() => {
        let isMounted = true

        ;(async () => {
            const result = await getCharacter()

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!isMounted) return

            if (result.isErr) {
                setError(createSome(result.err))
                return
            }

            if (result.value.isNone) {
                return
            }

            setFetchCharacter(createSome(result.value.value))
        })()

        return () => {
            isMounted = false
        }
    }, [])

    const isLoading: boolean = useMemo(() => {
        return fetchCharacter.isNone && error.isNone
    }, [fetchCharacter, error])

    const characters: Array<SinglePageGetCharacters> = useMemo(() => {
        if (fetchCharacter.isNone) {
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
