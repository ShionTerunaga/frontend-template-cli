import type { CheckerProps } from '@/shared/types/object'
import { Card } from '@/components/layout'
import { GridBox, Heading } from '@/components/ui'
import FontCenter from '@/components/ui/center/font-center/font-center'
import type { APIView } from '@/features/harry-potter'

interface Props<T extends APIView> {
    potters: Array<T>
    title: string
}

export function CardListView<T extends APIView, S extends Props<T>>(
    props: CheckerProps<S, Props<T>, 'Cache potter layout has not any props.'>,
) {
    const { potters, title } = props

    return (
        <section>
            <Heading>
                <FontCenter>{title}</FontCenter>
            </Heading>

            <GridBox>
                {potters.map(({ id, image, name }) => (
                    <Card
                        key={id}
                        src={image}
                        alt={id}
                        title={name}
                        srcWidth={150}
                        boxHeight={300}
                        srcHeight={200}
                    />
                ))}
            </GridBox>
        </section>
    )
}
