import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
  index,
  binary,
  text,
} from 'drizzle-orm/mysql-core'
import { relations, sql } from 'drizzle-orm'

export const user = mysqlTable('User', {
  id: binary('id', { length: 16 }).primaryKey().notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  email: varchar('email', { length: 255 }).unique(),
  newEmail: varchar('newEmail', { length: 255 }),
  nickname: varchar('nickname', { length: 255 }).notNull(),
  avatarUrl: text('avatarUrl'),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

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
    'year10', // for testing only
    'custom',
  ])
    .default('month2')
    .notNull(),
  predictionSrcStartDate: datetime('predictionSrcStartDate'),
})

export const configRelations = relations(config, ({ many }) => ({
  calendars: many(calendar),
}))

export type Config = typeof config.$inferSelect
export type NewConfig = typeof config.$inferInsert

export const calendar = mysqlTable('Calendar', {
  id: int('id').autoincrement().primaryKey().notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  configId: int('configId').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
})

export type Calendar = typeof calendar.$inferSelect
export type NewCalendar = typeof calendar.$inferInsert

export const calendarRelations = relations(calendar, ({ one }) => ({
  config: one(config, { fields: [calendar.configId], references: [config.id] }),
}))

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
        table.parentSleepId,
        table.userId,
        table.start,
        table.end
      ),
    }
  }
)

export type Sleep = typeof sleep.$inferSelect
export type NewSleep = typeof sleep.$inferInsert

export const sleepRelations = relations(sleep, ({ one, many }) => ({
  user: one(user, { fields: [sleep.userId], references: [user.id] }),
  segmentedSleeps: many(sleep, { relationName: 'segmentedSleeps' }),
  parentSleep: one(sleep, {
    fields: [sleep.parentSleepId],
    references: [sleep.id],
    relationName: 'segmentedSleeps',
  }),
}))
