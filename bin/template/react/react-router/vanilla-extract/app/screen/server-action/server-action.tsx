import type { RandomDogRes } from '@/features/random-dog/model/random-dog'
import type { FetcherError } from '@/shared/error/fetcher'
import type { Result } from 'ts-common-by-teru'
import type { Option } from 'ts-common-by-teru'
import { Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'
import { Form } from 'react-router'
import { SubmitButton } from '@/features/random-dog'

export default function ServerActionView({
    action,
}: {
    action?: Result<Option<RandomDogRes>, FetcherError>
}) {
    return (
        <main>
            <Heading>{ja.app.serverActionPotter.title}</Heading>
            <Form method="post">
                <SubmitButton title={ja.app.serverActionPotter.button} />
            </Form>
            {action && (
                <>
                    <div>
                        {action.isOk && action.value.isSome ? (
                            <img
                                alt="Random dog"
                                width={150}
                                height={150}
                                src={action.value.value.message}
                            />
                        ) : null}
                    </div>

                    <div>
                        {action.isErr ? (
                            <p>Error: {action.err.message}</p>
                        ) : null}
                    </div>
                </>
            )}
        </main>
    )
}
