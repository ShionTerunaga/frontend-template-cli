import { Box, Heading } from "@/components/ui";
import { ja } from "@/shared/lang/ja";
import classMerger from "@/utils/class-merger";
import Link from "next/link";

export const metadata = {
    title: ja.app.home.title,
    description: "Next.js サンプルアプリのホームページです。"
};

export default function Home() {
    return (
        <Box
            as="main"
            className={classMerger([
                "min-h-[100dvh]",
                "bg-[radial-gradient(circle_at_10%_20%,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)]",
                "px-6",
                "py-[72px]"
            ])}
        >
            <Box
                as="section"
                className={classMerger([
                    "w-full",
                    "max-w-[920px]",
                    "mx-auto",
                    "rounded-3xl",
                    "p-8",
                    "border",
                    "border-[#dbe1ea]",
                    "bg-white/[0.88]",
                    "shadow-[0_22px_50px_rgba(15,23,42,0.12)]"
                ])}
            >
                <Heading
                    className={classMerger(["mb-4", "tracking-[-0.03em]"])}
                >
                    {ja.app.home.title}
                </Heading>
                <p
                    className={classMerger([
                        "mb-6",
                        "leading-[1.6]",
                        "text-slate-700"
                    ])}
                >
                    ルーティング、キャッシュ戦略、Server Action
                    をこのテンプレートで すぐ試せます。
                </p>
                <ul
                    className={classMerger([
                        "grid",
                        "list-none",
                        "gap-3",
                        "p-0"
                    ])}
                >
                    <li>
                        <Link
                            className={classMerger([
                                "block",
                                "rounded-xl",
                                "border",
                                "border-slate-300",
                                "bg-slate-50",
                                "px-4",
                                "py-[14px]",
                                "font-medium",
                                "text-slate-900",
                                "no-underline",
                                "transition-[transform,box-shadow,border-color]",
                                "duration-200",
                                "ease-in",
                                "hover:-translate-y-0.5",
                                "hover:border-blue-400",
                                "hover:shadow-[0_10px_24px_rgba(59,130,246,0.16)]"
                            ])}
                            href="/force-cache-potter"
                        >
                            {ja.app.home.toForceCachePotter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classMerger([
                                "block",
                                "rounded-xl",
                                "border",
                                "border-slate-300",
                                "bg-slate-50",
                                "px-4",
                                "py-[14px]",
                                "font-medium",
                                "text-slate-900",
                                "no-underline",
                                "transition-[transform,box-shadow,border-color]",
                                "duration-200",
                                "ease-in",
                                "hover:-translate-y-0.5",
                                "hover:border-blue-400",
                                "hover:shadow-[0_10px_24px_rgba(59,130,246,0.16)]"
                            ])}
                            href="/no-store-potter"
                        >
                            {ja.app.home.toNoStorePotter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classMerger([
                                "block",
                                "rounded-xl",
                                "border",
                                "border-slate-300",
                                "bg-slate-50",
                                "px-4",
                                "py-[14px]",
                                "font-medium",
                                "text-slate-900",
                                "no-underline",
                                "transition-[transform,box-shadow,border-color]",
                                "duration-200",
                                "ease-in",
                                "hover:-translate-y-0.5",
                                "hover:border-blue-400",
                                "hover:shadow-[0_10px_24px_rgba(59,130,246,0.16)]"
                            ])}
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
