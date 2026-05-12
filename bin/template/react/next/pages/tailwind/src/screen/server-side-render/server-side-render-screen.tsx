import { Box } from "@/components/ui";
import { CardListView } from "@/components/view";
import { APIView } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { CheckerProps } from "@/shared/types/object";
import { Result } from "ts-shared";
import { Option } from "ts-shared";
import { FetcherError } from "@/shared/error/fetcher";

interface Props {
    character: Result<Option<APIView[]>, FetcherError>;
}

function ServerSideRenderScreen<T extends Props>(
    props: CheckerProps<T, Props, "This props is different from Props.">
) {
    const { character } = props;

    if (character.isErr) {
        return <Box>サーバーサイドレンダーが失敗してます。</Box>;
    }

    if (character.value.isNone) {
        return <Box>表示するデータがありません。</Box>;
    }

    return (
        <CardListView
            potters={character.value.value}
            title={ja.app.serverSideRenderPotter.title}
        />
    );
}

export default ServerSideRenderScreen;
