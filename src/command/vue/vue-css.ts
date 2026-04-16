import { type Result } from "../../utils/result";
import { type Option } from "../../utils/option";
import { isVueCss } from "../../template/vue/vue-is";
import type { VueCss } from "../../template/vue/vue-static";
import { cssCommand } from "../css/css-core";

export async function vueCssCommander(
    optionVueCss: Option<unknown>
): Promise<Result<VueCss, Error>> {
    const choises = [
        { title: "scoped-css", value: "scoped-css" },
        { title: "vanilla-extract", value: "vanilla-extract" }
    ];

    return await cssCommand({
        optionCss: optionVueCss,
        isCss: isVueCss,
        csses: choises
    });
}
