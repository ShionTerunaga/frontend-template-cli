/**
 * 柔軟なオブジェクト
 */
export type Dict<T> = Record<string, T>

/**
 * props定義の時に使う
 */
export type CheckerProps<T, TExpect, TError extends string> = T &
  (Exclude<keyof T, keyof TExpect> extends never ? object : TError)
