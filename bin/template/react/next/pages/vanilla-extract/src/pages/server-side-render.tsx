import { APIView, getCharacter } from "@/features/harry-potter";
import { Result } from "ts-shared";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ServerSideRenderScreen from "@/screen/server-side-render/server-side-render-screen";
import { Option } from "ts-shared";
import { FetcherError } from "@/shared/error/fetcher";

interface Props {
    character: Result<Option<APIView[]>, FetcherError>;
}

export const getServerSideProps = (async () => {
    const character = await getCharacter();

    return {
        props: {
            character
        }
    };
}) satisfies GetServerSideProps<Props>;

export default function ServerSideRender({
    character
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <ServerSideRenderScreen character={character} />;
}
