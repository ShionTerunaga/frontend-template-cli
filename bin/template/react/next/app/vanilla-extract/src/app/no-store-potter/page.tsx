import { Box } from "@/components/ui";
import { CardListView } from "@/components/view";
import { getCharacter } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { Suspense } from "react";

export const metadata = {
    title: ja.app.noStorePotter.title,
    description: "no-store を使った Harry Potter データ取得ページです。"
};

export const dynamic = "force-dynamic";

async function NoStorePotter() {
    const potters = await getCharacter("no-store");

    if (potters.isErr) {
        return <Box>error</Box>;
    }

    if (potters.value.isNone) {
        return <Box>no data</Box>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CardListView
                potters={potters.value.value}
                title={ja.app.noStorePotter.title}
            />
        </Suspense>
    );
}

export default NoStorePotter;
