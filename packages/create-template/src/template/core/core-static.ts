import { Option } from "../../utils/option";
import { ReactCss, ReactLibrarySettings } from "../react/react-static";
import { VueCss } from "../vue/vue-static";

export const techStacks = ["react", "vue"] as const;
export type TechStack = (typeof techStacks)[number];

export const techStackSelectList = [
    { title: "React", value: "react" },
    { title: "Vue", value: "vue" }
];

export type TechStackList = ReactLibrarySettings;

export type TechStackCss = ReactCss | VueCss;

export interface TechMaterial {
    path: string;
    styleSheet: Option<TechStackCss>;
}

export interface RunSuccess {
    name: string;
    tech: TechStack;
}
