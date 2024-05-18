import { cache } from 'react'
import { createUncachedPrisma } from './prisma'

export const createPrisma = cache(createUncachedPrisma)
