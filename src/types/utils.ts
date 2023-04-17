export type QueryType<T> = {
  [K in keyof T]: T[K] extends unknown[] ? string[] : string
}

export type BodyType<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}
