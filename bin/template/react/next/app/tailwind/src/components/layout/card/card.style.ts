// Tailwind class map replacing vanilla-extract styles
// Arbitrary values use JIT (e.g., rounded-[10px], text-[1.2rem])
const cardStyles = {
    cardContainer:
        "border border-gray-300 rounded-[10px] overflow-hidden shadow-md text-center m-4",
    image: "object-cover",
    title: "p-4 text-[1.2rem] font-bold text-gray-700 m-0"
} as const;

export default cardStyles;
