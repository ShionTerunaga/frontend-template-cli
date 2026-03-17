export default function classMerger(classes: Array<string>): string {
    const seen = new Set<string>();
    const out: string[] = [];

    for (const cls of classes) {
        if (cls === "") continue;

        if (!seen.has(cls)) {
            seen.add(cls);
            out.push(cls);
        }
    }

    return out.join(" ");
}
