/**
 * 柔軟なオブジェクト
 */
export type Dict<T> = Record<string, T>;

/**
 * props定義の時に使う
 */
export type CheckerProps<T, TExpect, TError extends string> = T &
    (Exclude<keyof T, keyof TExpect> extends never ? object : TError);

/**
 * Omitよりも厳密に型をチェックする(Omitは余計なプロパティを許容してしまう)
 */
export type Without<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
} & {
    [P in K]?: never;
};
