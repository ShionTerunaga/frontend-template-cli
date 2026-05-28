import { Box } from "@/components/ui";
import { isNone } from 'ts-utility-kit/option'
import { isErr } from 'ts-utility-kit/result'
import { CardListView } from "@/components/view";
import { getCharacter } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";

async function ForceCachePotter() {
    const potters = await getCharacter("force-cache");

    if (isErr(potters)) {
        return <Box>error</Box>;
    }

    if (isNone(potters.value)) {
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
