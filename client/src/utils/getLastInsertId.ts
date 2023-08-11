'use server'

import { sql } from 'drizzle-orm'
import { db } from '@/db'

export const getLastInsertId = async () => {
  const res = await db.execute(sql`select last_insert_id()`)
  const id: number = (res.rows[0] as any)['last_insert_id()']

  return id
}
