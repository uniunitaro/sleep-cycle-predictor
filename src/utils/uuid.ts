import { sql } from 'drizzle-orm'
import { MySqlColumn } from 'drizzle-orm/mysql-core'

export const uuidToBin = (uuid: string) => {
  return sql`UUID_TO_BIN(${uuid}, 1)`
}

export const binToUuid = (bin: MySqlColumn) => {
  return sql<string>`BIN_TO_UUID(${bin}, 1)`
}
