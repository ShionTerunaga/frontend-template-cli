import { Card } from "@/components/layout";
import { Box, GridBox, Heading } from "@/components/ui";
import { FontCenter } from "@/components/ui/center/font-center/font-center";
import { SinglePageGetCharacters } from "@/features/harry-potter";
import { CheckerProps } from "@/shared/types/object";

interface Props<T extends SinglePageGetCharacters> {
    potters: Array<T>;
    title: string;
}

export function CardListView<
    T extends SinglePageGetCharacters,
    S extends Props<T>
>(props: CheckerProps<S, Props<T>, "Cache potter layout has not any props.">) {
    const { potters, title } = props;

    return (
        <Box as="section">
            <FontCenter>
                <Heading>{title}</Heading>
            </FontCenter>

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
        </Box>
    );
}
