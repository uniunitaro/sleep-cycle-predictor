import { drizzle, MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { sql } from 'drizzle-orm'
import * as schema from '@/db/schema'
import '@testing-library/jest-dom'

jest.mock('@/db', () => ({
  db: undefined,
}))

let connection: mysql.Connection
let db: MySql2Database<typeof schema>
let jestDb: MySql2Database<typeof schema>

beforeAll(async () => {
  connection = await mysql.createConnection(process.env.DATABASE_URL!)
  db = drizzle(connection, { schema: schema, mode: 'default' })
})

afterAll(() => {
  connection.end()
})

let rollbackTransaction: () => void

beforeEach(
  () =>
    new Promise<void>((resolve) => {
      db.transaction((tx) => {
        jestDb = tx
        // この方法でのみdbをモックできる
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const originalDb = require('@/db')
        originalDb.db = jestDb
        resolve()

        return new Promise((_, reject) => {
          rollbackTransaction = reject
        })
      }).catch(() => {
        // ignore
      })
    })
)

afterEach(() => {
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
jest.mock('next/navigation')

jest.mock('@/features/auth/components/GoogleLogo')
jest.mock('@/features/auth/components/XLogo')
