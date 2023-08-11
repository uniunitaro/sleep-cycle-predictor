import { drizzle, MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { sql } from 'drizzle-orm'
import * as schema from '@/db/schema'

jest.mock('@/db', () => ({
  db: undefined,
}))

let connection: mysql.Connection
let db: MySql2Database<typeof schema>
let jestDb: Parameters<Parameters<typeof db.transaction>[0]>[0] | undefined =
  undefined

beforeAll(async () => {
  connection = await mysql.createConnection(process.env.DATABASE_URL!)
  db = drizzle(connection, { schema: schema, mode: 'default' })
})

afterAll(() => {
  connection.end()
})

let rollbackTransaction: (value: void) => void

beforeEach(
  () =>
    new Promise<void>((resolve) => {
      db.transaction((tx) => {
        return new Promise((_, reject) => {
          jestDb = tx
          // この方法でのみdbをモックできる
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const actualDb = require('./src/db')
          actualDb.db = jestDb
          resolve()

          rollbackTransaction = reject
        })
      }).catch(() => {
        // ignore
      })
    })
)

afterEach(async () => {
  rollbackTransaction()
})

// PlanetScaleと通常のMySQLではresの形式が異なるため別で実装
jest.mock('@/utils/getLastInsertId', () => ({
  getLastInsertId: jest.fn().mockImplementation(async () => {
    if (!jestDb) throw new Error('jestDb is undefined')

    const res = await jestDb.execute(sql`select last_insert_id()`)
    const id: number = (res[0] as any)[0]['last_insert_id()' as any]

    return id
  }),
}))

jest.mock('next/cache')
