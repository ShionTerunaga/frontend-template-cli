import ServerActionView from '@/screen/server-action/server-action'
import type { Route } from './+types/home'
import type { Result } from 'ts-common-by-teru'
import { getRandomDog } from '@/features/random-dog/service/get-random-dog'
import type { RandomDogRes } from '@/features/random-dog/model/random-dog'
import type { Option } from 'ts-common-by-teru'
import type { FetcherError } from '@/shared/error/fetcher'

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'random dog' },
        { name: 'description', content: 'get a random dog image' },
    ]
}

export async function action(): Promise<
    Result<Option<RandomDogRes>, FetcherError>
> {
    const dog = await getRandomDog()

    return dog
}

export type ActionData = Awaited<ReturnType<typeof action>>

export default function ServerActionRoute({
    actionData,
}: {
    actionData: ActionData
}) {
    return <ServerActionView action={actionData} />
}
