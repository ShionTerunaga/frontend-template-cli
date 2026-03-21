// Tailwind utility class maps replacing vanilla-extract styleVariants.
// NOTE: Width/height use arbitrary values (e.g., w-[150px]) relying on Tailwind JIT.
export const boxVariants = {
    boxWidthStyle: {
        small: "w-[150px]",
        middle: "w-[300px]",
        big: "w-[450px]",
        auto: "w-auto",
        full: "w-screen"
    },
    boxHeightStyle: {
        small: "h-[150px]",
        middle: "h-[300px]",
        big: "h-[450px]",
        auto: "h-auto",
        full: "h-screen"
    },
    boxBorderRadiusStyle: {
        none: "",
        small: "rounded-sm",
        middle: "rounded-md",
        big: "rounded-xl",
        full: "rounded-full"
    },
    border: {
        none: "",
        thin: "border border-gray-200",
        middle: "border-2 border-gray-300",
        thick: "border-4 border-gray-400"
    },
    boxShadowStyle: {
        none: "",
        small: "shadow-sm",
        middle: "shadow-md",
        big: "shadow-xl"
    },
    colorStyle: {
        white: "bg-white text-slate-900",
        lightGray: "bg-slate-100 text-slate-900",
        gray: "bg-slate-200 text-slate-900",
        darkGray: "bg-slate-400 text-slate-900",
        black: "bg-slate-900 text-white",
        red: "bg-red-400 text-neutral-900",
        blue: "bg-blue-400 text-blue-900",
        green: "bg-green-400 text-green-900"
    }
};
