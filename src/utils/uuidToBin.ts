import { sql } from 'drizzle-orm'

export const uuidToBin = (uuid: string) => {
  return sql`UUID_TO_BIN(${uuid}, 1)`
}
