import { Box, Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'
import { classMerger } from 'ts-shared'
import { Link } from '@tanstack/react-router'

function HomeLayout() {
    return (
        <Box
            as="main"
            className={classMerger([
                'min-h-[100dvh]',
                'bg-[radial-gradient(circle_at_10%_20%,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)]',
                'px-6',
                'py-[72px]',
            ])}
        >
            <Box
                as="section"
                className={classMerger([
                    'w-full',
                    'max-w-[920px]',
                    'mx-auto',
                    'rounded-3xl',
                    'p-8',
                    'border',
                    'border-[#dbe1ea]',
                    'bg-white/[0.88]',
                    'shadow-[0_22px_50px_rgba(15,23,42,0.12)]',
                ])}
            >
                <Heading
                    className={classMerger(['mb-4', 'tracking-[-0.03em]'])}
                >
                    {ja.app.home.title}
                </Heading>
                <p
                    className={classMerger([
                        'mb-6',
                        'leading-[1.6]',
                        'text-slate-700',
                    ])}
                >
                    ルーティングと動的データ取得をこのテンプレートで
                    すぐ試せます。
                </p>

                <ul
                    className={classMerger([
                        'grid',
                        'list-none',
                        'gap-3',
                        'p-0',
                    ])}
                >
                    <li>
                        <Link
                            className={classMerger([
                                'block',
                                'rounded-xl',
                                'border',
                                'border-slate-300',
                                'bg-slate-50',
                                'px-4',
                                'py-[14px]',
                                'font-medium',
                                'text-slate-900',
                                'no-underline',
                                'transition-[transform,box-shadow,border-color]',
                                'duration-200',
                                'ease-in',
                                'hover:-translate-y-0.5',
                                'hover:border-blue-400',
                                'hover:shadow-[0_10px_24px_rgba(59,130,246,0.16)]',
                            ])}
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
