import { MySqlTable } from 'drizzle-orm/mysql-core'
import { faker } from '@faker-js/faker'
import { db } from '@/db'
import { NewConfig, NewSleep, NewUser, sleep, user } from '@/db/schema'

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

const defaultUser: NewUser = {
  id: faker.string.uuid(),
  nickname: faker.person.firstName(),
  email: faker.internet.email(),
}
export const userFactory = createFactory<NewUser>(user, defaultUser)

const defaultConfig: NewConfig = {
  userId: faker.string.uuid(),
}
export const configFactory = createFactory<NewConfig>(user, defaultConfig)

const defaultSleep: NewSleep = {
  start: faker.date.past(),
  end: faker.date.past(),
  userId: faker.string.uuid(),
}
export const sleepFactory = createFactory<NewSleep>(sleep, defaultSleep)
