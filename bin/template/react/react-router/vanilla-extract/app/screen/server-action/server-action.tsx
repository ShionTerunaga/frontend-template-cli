import type { RandomDogRes } from '@/features/random-dog/model/random-dog'
import type { FetcherError } from '@/shared/error/fetcher'
import { isErr, type Result } from 'ts-utility-kit/result'
import { isSome, type Option } from 'ts-utility-kit/option'
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
                        {!isErr(action) && isSome(action.value) ? (
                            <img
                                alt="Random dog"
                                width={150}
                                height={150}
                                src={action.value.value.message}
                            />
                        ) : null}
                    </div>

                    <div>
                        {isErr(action) ? (
                            <p>Error: {action.err.message}</p>
                        ) : null}
                    </div>
                </>
            )}
        </main>
    )
}
