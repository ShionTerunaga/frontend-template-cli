import { Box } from "@/lib/ui";
import { isNone } from "ts-utility-kit/option";
import { isErr } from "ts-utility-kit/result";
import { getCharacter, CardListView } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { Suspense } from "react";

export const metadata = {
    title: ja.app.noStorePotter.title,
    description: "no-store を使った Harry Potter データ取得ページです。"
};

export const dynamic = "force-dynamic";

async function NoStorePotter() {
    const potters = await getCharacter("no-store");

    if (isErr(potters)) {
        return <Box>error</Box>;
    }

    if (isNone(potters.value)) {
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
