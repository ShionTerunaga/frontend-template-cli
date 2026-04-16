import { type Option } from "../../utils/option";
import { isReactCss } from "./react-is";
import { cssCommand } from "../css/css-core";
import type { ReactCss } from "../../template/react/react-static";

export async function cssReactCommand(optionReactCss: Option<unknown>) {
    const choises = [
        { title: "tailwindCSS", value: "tailwind" },
        { title: "vanilla-extract ", value: "vanilla-extract" }
    ];

    return await cssCommand<ReactCss>({
        optionCss: optionReactCss,
        isCss: isReactCss,
        csses: choises
    });
}
