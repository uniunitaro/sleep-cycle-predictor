import { MySqlTable } from 'drizzle-orm/mysql-core'
import { faker } from '@faker-js/faker'
import { SQL } from 'drizzle-orm'
import { db } from '@/db'
import { NewConfig, NewSleep, NewUser, config, sleep, user } from '@/db/schema'

type AddUnionToType<T, U> = T extends object
  ? {
      [K in keyof T]: T[K] | U
    }
  : T | U

type InsertType<T> = AddUnionToType<T, SQL<unknown>>

const createFactory = <InsertType>(
  model: MySqlTable,
  defaultValues: InsertType
) => ({
  create: async (values?: Partial<InsertType> | Partial<InsertType>[]) => {
    if (Array.isArray(values)) {
      return await db
        .insert(model)
        .values(values.map((v) => ({ ...defaultValues, ...v })))
    }
    return await db.insert(model).values({ ...defaultValues, ...values })
  },
})

const defaultUser: InsertType<NewUser> = {
  id: faker.string.uuid(),
  nickname: faker.person.firstName(),
  email: faker.internet.email(),
}
export const userFactory = createFactory<InsertType<NewUser>>(user, defaultUser)

const defaultConfig: InsertType<NewConfig> = {
  userId: faker.string.uuid(),
}
export const configFactory = createFactory<InsertType<NewConfig>>(
  config,
  defaultConfig
)

const defaultSleep: InsertType<NewSleep> = {
  start: faker.date.past(),
  end: faker.date.past(),
  userId: faker.string.uuid(),
}
export const sleepFactory = createFactory<InsertType<NewSleep>>(
  sleep,
  defaultSleep
)
