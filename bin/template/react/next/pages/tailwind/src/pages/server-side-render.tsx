import { APIView, getCharacter } from "@/features/harry-potter";
import type { Result } from 'ts-utility-kit/result'
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ServerSideRenderScreen from "@/screen/server-side-render/server-side-render-screen";
import type { Option } from 'ts-utility-kit/option'
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
