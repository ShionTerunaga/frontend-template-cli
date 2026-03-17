import { ja } from "@/shared/lang/ja";
import RandomStart from "./_components/random-start/random-start";
import { Box, Heading } from "@/components/ui";
import classMerger from "@/utils/class-merger";

export const metadata = {
    title: ja.app.serverActionSample.title,
    description: "Server Actions でランダム犬画像を取得するサンプルページです。"
};

function ServerActionSample() {
    return (
        <Box
            as="main"
            className={classMerger([
                "flex",
                "min-h-dvh",
                "justify-center",
                "bg-[radial-gradient(circle_at_top_right,#bfdbfe_0%,#e2e8f0_30%,#f8fafc_100%)]",
                "px-6",
                "py-16"
            ])}
        >
            <Box
                className={classMerger([
                    "w-full",
                    "max-w-[960px]",
                    "rounded-3xl",
                    "border",
                    "border-[#dbe1ea]",
                    "bg-white/[0.82]",
                    "px-5",
                    "pb-9",
                    "pt-7"
                ])}
            >
                <Heading as="h1" className={classMerger(["text-center"])}>
                    {ja.app.serverActionSample.title}
                </Heading>
                <RandomStart />
            </Box>
        </Box>
    );
}

export default ServerActionSample;
