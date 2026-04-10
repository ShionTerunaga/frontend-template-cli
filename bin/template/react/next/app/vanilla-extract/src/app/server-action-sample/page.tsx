import { ja } from "@/shared/lang/ja";
import RandomStart from "./_components/random-start/random-start";
import { Box, Heading } from "@/components/ui";
import serverActionSamplePageStyle from "./page.css";

export const metadata = {
    title: ja.app.serverActionSample.title,
    description: "Server Actions でランダム犬画像を取得するサンプルページです。"
};

function ServerActionSample() {
    return (
        <Box as="main" className={serverActionSamplePageStyle.page}>
            <Box className={serverActionSamplePageStyle.inner}>
                <Heading as="h1" className={serverActionSamplePageStyle.title}>
                    {ja.app.serverActionSample.title}
                </Heading>
                <RandomStart />
            </Box>
        </Box>
    );
}

export default ServerActionSample;
