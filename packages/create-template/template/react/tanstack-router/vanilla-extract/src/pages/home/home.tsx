import { Box, Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'
import { Link } from '@tanstack/react-router'
import homePageStyle from './home.css'

function HomeLayout() {
    return (
        <Box as="main" className={homePageStyle.pageRoot}>
            <Box as="section" className={homePageStyle.container}>
                <Heading className={homePageStyle.heading}>
                    {ja.app.home.title}
                </Heading>
                <p className={homePageStyle.description}>
                    ルーティングと動的データ取得をこのテンプレートで
                    すぐ試せます。
                </p>

                <ul className={homePageStyle.navList}>
                    <li>
                        <Link
                            className={homePageStyle.navItemLink}
                            to="/single-dynamic-fetch"
                        >
                            {ja.app.home.toSingleDynamicPotter}
                        </Link>
                    </li>
                </ul>
            </Box>
        </Box>
    )
}

export default HomeLayout
