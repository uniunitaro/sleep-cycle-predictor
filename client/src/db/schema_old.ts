import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, unique, int, datetime, varchar, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const config = mysqlTable("Config", {
	id: int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
	userId: varchar("userId", { length: 191 }).notNull(),
	predictionSrcDuration: mysqlEnum("predictionSrcDuration", ['week1','week2','month1','month2','month3','month4','month6','year1']).default('month2').notNull(),
},
(table) => {
	return {
		userIdIdx: index("Config_userId_idx").on(table.userId),
		configUserIdKey: unique("Config_userId_key").on(table.userId),
	}
});

export const segmentedSleep = mysqlTable("SegmentedSleep", {
	id: int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
	sleepId: int("sleepId").notNull(),
	start: datetime("start", { mode: 'string', fsp: 3 }).notNull(),
	end: datetime("end", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => {
	return {
		sleepIdIdx: index("SegmentedSleep_sleepId_idx").on(table.sleepId),
	}
});

export const sleep = mysqlTable("Sleep", {
	id: int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
	userId: varchar("userId", { length: 191 }).notNull(),
	start: datetime("start", { mode: 'string', fsp: 3 }).notNull(),
	end: datetime("end", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => {
	return {
		userIdIdx: index("Sleep_userId_idx").on(table.userId),
	}
});

export const user = mysqlTable("User", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	email: varchar("email", { length: 191 }),
	nickname: varchar("nickname", { length: 191 }).notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => {
	return {
		userEmailKey: unique("User_email_key").on(table.email),
	}
});