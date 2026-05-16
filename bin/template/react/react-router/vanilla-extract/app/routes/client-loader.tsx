import type { Result } from 'ts-shared'
import type { Route } from '../+types/root'
import { getCharacter, type APIView } from '@/features/harry-potter'
import type { FetcherError } from '@/shared/error/fetcher'
import type { Option } from 'ts-shared'
import ClientLoaderView from '@/screen/client-loader/client-loader'

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'client Loader' },
        { name: 'description', content: 'This is the client loader route.' },
    ]
}

export async function clientLoader({}: Route.LoaderArgs): Promise<
    Result<Option<Array<APIView>>, FetcherError>
> {
    const characters = await getCharacter()

    return characters
}

export function HydrateFallback() {
    return <div>Loading...</div>
}

type ClientLoaderData = Awaited<ReturnType<typeof clientLoader>>

export default function ClientLoaderRoute({
    loaderData,
}: {
    loaderData: ClientLoaderData
}) {
    const character = loaderData

    return <ClientLoaderView characters={character} />
}
