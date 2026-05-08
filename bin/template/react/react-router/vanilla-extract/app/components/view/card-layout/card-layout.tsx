import type { Result } from 'ts-shared'
import type { Option } from 'ts-shared'
import type { FetcherError } from '@/shared/error/fetcher'
import type { APIView } from '@/features/harry-potter'
import type { CheckerProps } from '@/shared/types/object'
import { Box } from '@/components/ui'
import { CardListView } from '@/components/view'

interface Props {
    characters: Result<Option<Array<APIView>>, FetcherError>
    title: string
}

export function CardLayout<T extends Props>({
    characters,
    title,
}: CheckerProps<T, Props, 'Invalid props'>) {
    if (characters.isErr) {
        return <Box>Error: {characters.err.message}</Box>
    }

    if (characters.value.isNone) {
        return <Box>No characters found.</Box>
    }

    return <CardListView potters={characters.value.value} title={title} />
}
