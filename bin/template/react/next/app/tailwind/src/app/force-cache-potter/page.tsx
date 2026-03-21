import { Box } from "@/components/ui";
import { CardListView } from "@/components/view";
import { getCharacter } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";

async function ForceCachePotter() {
    const potters = await getCharacter("force-cache");

    if (potters.isErr) {
        return <Box>error</Box>;
    }

    if (potters.value.isNone) {
        return <Box>no data</Box>;
    }

    return (
        <CardListView
            potters={potters.value.value}
            title={ja.app.forceCachePotter.title}
        />
    );
}

export default ForceCachePotter;
