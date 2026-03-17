import type { Dict } from "@/src/shared/types/object";

/**
 * オブジェクトから要素を省く関数（非破壊）
 * - 元オブジェクトは変更しません
 * - `as` / `any` を使わず、型ガードでキーを検証します
 */
export function isKeyOf<T extends object>(
    key: PropertyKey,
    obj: T
): key is keyof T {
    return typeof key === "string" ||
        typeof key === "number" ||
        typeof key === "symbol"
        ? key in obj
        : false;
}

export function isOmitObject<T extends object, S extends keyof T>(
    currentObj: Dict<unknown>,
    keys: S[]
): currentObj is Omit<T, S> {
    return keys.every((key) => !Object.keys(currentObj).includes(String(key)));
}

export function omitElementObject<T extends object, S extends keyof T>(
    obj: T,
    keys: S[]
): Omit<T, S> {
    const entries = Object.entries(obj).filter(([k]) => {
        return !keys.some((key) => String(key) === k);
    });

    const typedResult: Dict<unknown> = {};
    for (const [k, v] of entries) {
        if (isKeyOf(k, obj)) {
            typedResult[k] = v;
        }
    }

    if (!isOmitObject<T, S>(typedResult, keys)) {
        throw new Error("型の変換に失敗しました");
    }

    return typedResult;
}
