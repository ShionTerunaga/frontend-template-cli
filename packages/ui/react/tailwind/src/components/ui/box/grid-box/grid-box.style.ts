import classMerger from "@/utils/class-merger";

// Tailwind class maps replacing vanilla-extract style/styleVariants
export const gridBoxGap = {
    smallGap: "gap-[8px]", // 8px
    medium: "gap-[16px]", // 16px
    large: "gap-[24px]" // 24px
} as const;

export const gridBoxGridTemplate = {
    three: "grid-cols-[repeat(3,1fr)]",
    four: "grid-cols-[repeat(4,1fr)]",
    five: "grid-cols-[repeat(5,1fr)]"
} as const;

export const gridBoxBaseStyles = classMerger([
    "grid",
    "justify-items-center",
    "items-start",
    "w-full",
    "grid-cols-[repeat(1,minmax(0,1fr))]",
    "sm:grid-cols-[repeat(2,minmax(0,1fr))]"
]);
