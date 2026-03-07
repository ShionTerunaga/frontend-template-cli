import { Box, Heading } from "@/components/ui";
import { ja } from "@/shared/lang/ja";
import Link from "next/link";
import homePageStyle from "./page.css";

export const metadata = {
    title: ja.app.home.title,
    description: "Next.js サンプルアプリのホームページです。"
};

export default function Home() {
    return (
        <Box as="main" className={homePageStyle.pageRoot}>
            <Box as="section" className={homePageStyle.container}>
                <Heading className={homePageStyle.heading}>
                    {ja.app.home.title}
                </Heading>
                <p className={homePageStyle.description}>
                    ルーティング、キャッシュ戦略、Server Action
                    をこのテンプレートで すぐ試せます。
                </p>
                <ul className={homePageStyle.navList}>
                    <li>
                        <Link
                            className={homePageStyle.navItemLink}
                            href="/force-cache-potter"
                        >
                            {ja.app.home.toForceCachePotter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={homePageStyle.navItemLink}
                            href="/no-store-potter"
                        >
                            {ja.app.home.toNoStorePotter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={homePageStyle.navItemLink}
                            href="/server-action-sample"
                        >
                            {ja.app.home.toServerActionSample}
                        </Link>
                    </li>
                </ul>
            </Box>
        </Box>
    );
}
