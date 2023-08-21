import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
  index,
  binary,
} from 'drizzle-orm/mysql-core'
import { InferModel, relations, sql } from 'drizzle-orm'

export const user = mysqlTable('User', {
  id: binary('id', { length: 16 }).primaryKey().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  nickname: varchar('nickname', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
})

export type User = InferModel<typeof user>
export type NewUser = InferModel<typeof user, 'insert'>

export const userRelations = relations(user, ({ one, many }) => ({
  config: one(config, { fields: [user.id], references: [config.userId] }),
  sleeps: many(sleep),
}))

export const config = mysqlTable('Config', {
  id: int('id').autoincrement().primaryKey().notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  userId: binary('userId', { length: 16 }).unique(),
  predictionSrcDuration: mysqlEnum('predictionSrcDuration', [
    'week1',
    'week2',
    'month1',
    'month2',
    'month3',
    'month4',
    'month6',
    'year1',
  ])
    .default('month2')
    .notNull(),
})

export type Config = InferModel<typeof config>
export type NewConfig = InferModel<typeof config, 'insert'>

export const sleep = mysqlTable(
  'Sleep',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    createdAt: timestamp('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
    userId: binary('userId', { length: 16 }).notNull(),
    start: datetime('start').notNull(),
    end: datetime('end').notNull(),
    parentSleepId: int('parentSleepId'),
  },
  (table) => {
    return {
      userIdIdx: index('userIdIdx').on(table.userId),
      parentSleepIdIdx: index('parentSleepIdIdx').on(table.parentSleepId),
      searchIdx: index('searchIdx').on(
        table.userId,
        table.parentSleepId,
        table.start,
        table.end
      ),
    }
  }
)

export type Sleep = InferModel<typeof sleep>
export type NewSleep = InferModel<typeof sleep, 'insert'>

export const sleepRelations = relations(sleep, ({ one, many }) => ({
  user: one(user, { fields: [sleep.userId], references: [user.id] }),
  segmentedSleeps: many(sleep, { relationName: 'segmentedSleeps' }),
  parentSleep: one(sleep, {
    fields: [sleep.parentSleepId],
    references: [sleep.id],
    relationName: 'segmentedSleeps',
  }),
}))
