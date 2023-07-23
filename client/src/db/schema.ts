import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  unique,
  int,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
} from 'drizzle-orm/mysql-core'
import { InferModel, relations, sql } from 'drizzle-orm'

export const user = mysqlTable(
  'User',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    email: varchar('email', { length: 255 }).unique(),
    nickname: varchar('nickname', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').onUpdateNow().notNull(),
  }
  // (table) => {
  //   return {
  //     userEmailKey: unique('User_email_key').on(table.email),
  //   }
  // }
)

export const userRelations = relations(user, ({ one, many }) => ({
  config: one(config, { fields: [user.id], references: [config.userId] }),
  sleeps: many(sleep),
}))

export const config = mysqlTable(
  'Config',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').onUpdateNow().notNull(),
    userId: varchar('userId', { length: 255 }).notNull().unique(),
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
  }
  // (table) => {
  //   return {
  //     userIdIdx: index('Config_userId_idx').on(table.userId),
  //   }
  // }
)

export const sleep = mysqlTable(
  'Sleep',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').onUpdateNow().notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    start: datetime('start').notNull(),
    end: datetime('end').notNull(),
  }
  // (table) => {
  //   return {
  //     userIdIdx: index('Sleep_userId_idx').on(table.userId),
  //   }
  // }
)

export const sleepRelations = relations(sleep, ({ one, many }) => ({
  user: one(user, { fields: [sleep.userId], references: [user.id] }),
  segmentedSleeps: many(segmentedSleep),
}))

export const segmentedSleep = mysqlTable(
  'SegmentedSleep',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').onUpdateNow().notNull(),
    sleepId: int('sleepId').notNull(),
    start: datetime('start').notNull(),
    end: datetime('end').notNull(),
  }
  // (table) => {
  //   return {
  //     sleepIdIdx: index('SegmentedSleep_sleepId_idx').on(table.sleepId),
  //   }
  // }
)

export const segmentedSleepRelations = relations(segmentedSleep, ({ one }) => ({
  sleep: one(sleep, {
    fields: [segmentedSleep.sleepId],
    references: [sleep.id],
  }),
}))
