import { APIView, getCharacter } from "@/features/harry-potter";
import StaticGeneratorScreen from "@/screen/static-generator/static-generator";
import { Result } from "ts-shared";
import { Option } from "ts-shared";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { FetcherError } from "@/shared/error/fetcher";

interface Props {
    character: Result<Option<APIView[]>, FetcherError>;
}

export const getStaticProps = (async () => {
    const character = await getCharacter();

    return {
        props: {
            character
        }
    };
}) satisfies GetStaticProps<Props>;

export default function StaticGenerator({
    character
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return <StaticGeneratorScreen character={character} />;
}
