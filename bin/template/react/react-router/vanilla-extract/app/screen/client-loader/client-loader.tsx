import type { Result } from 'ts-common-by-teru'
import type { Option } from 'ts-common-by-teru'
import type { FetcherError } from '@/shared/error/fetcher'
import type { APIView } from '@/features/harry-potter'
import type { CheckerProps } from '@/shared/types/object'
import { CardLayout } from '@/components/view'
import { ja } from '@/shared/lang/ja'

interface Props {
    characters: Result<Option<Array<APIView>>, FetcherError>
}

export default function ClientLoaderView<T extends Props>({
    characters,
}: CheckerProps<T, Props, 'Invalid props'>) {
    return (
        <CardLayout
            characters={characters}
            title={ja.app.clientLoaderPotter.title}
        />
    )
}
