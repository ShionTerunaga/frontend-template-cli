export type ErrorType = 'httpError' | 'fetcherError' | 'objectError'

export interface CustomError {
  type: ErrorType
  message: string
}
