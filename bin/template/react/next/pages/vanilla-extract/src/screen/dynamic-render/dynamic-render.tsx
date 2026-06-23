import { Box } from "@/components/ui";
import { CardListView } from "@/components/view";
import { useSinglePageCharacters } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { isSome } from 'ts-utility-kit/option'

function DynamicScreen() {
    const { isLoading, error, characters } = useSinglePageCharacters();

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (isSome(error)) {
        return <Box>動的取得が失敗してます。</Box>;
    }

    return (
        <CardListView
            potters={characters}
            title={ja.app.serverSideRenderPotter.title}
        />
    );
}

export default DynamicScreen;
