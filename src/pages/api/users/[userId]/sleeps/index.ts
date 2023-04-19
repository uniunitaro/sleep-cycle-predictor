import { NextApiHandler } from 'next'
import { getUserFromCookies } from 'next-firebase-auth'
import { initAuth } from '@/libs/firebase'
import { BodyType, QueryType } from '@/types/utils'
import { prisma } from '@/libs/prisma'

initAuth()

export type PostSleepRequest = {
  start: Date
  end: Date
}

export type PostSleepResponse = {
  id: number
  start: string
  end: string
}

export type GetSleepsRequest = {
  start: Date
  end: Date
}

export type GetSleepsResponse = {
  id: number
  start: string
  end: string
}[]

const handler: NextApiHandler = async (req, res) => {
  const { userId } = req.query
  if (userId === 'me') {
    switch (req.method) {
      case 'POST':
        try {
          const authUser = await getUserFromCookies({ req })
          if (!authUser.id) {
            return res.status(401).json({ error: 'Unauthorized.' })
          }

          const payload = req.body as BodyType<PostSleepRequest>
          const sleep = await prisma.sleep.create({
            data: {
              userId: authUser.id,
              start: payload.start,
              end: payload.end,
            },
          })

          const sleepResponse: PostSleepResponse = {
            id: sleep.id,
            start: sleep.start.toISOString(),
            end: sleep.end.toISOString(),
          }
          return res.status(200).json(sleepResponse)
        } catch (e) {
          console.log(e)
          return res.status(500).json({ error: 'Unexpected error.' })
        }

      case 'GET':
        try {
          const authUser = await getUserFromCookies({ req })
          if (!authUser.id) {
            return res.status(401).json({ error: 'Unauthorized.' })
          }

          const payload = req.query as QueryType<GetSleepsRequest>
          const sleeps = await prisma.sleep.findMany({
            where: {
              userId: authUser.id,
              start: {
                gte: payload.start,
              },
              end: {
                lte: payload.end,
              },
            },
            orderBy: {
              start: 'asc',
            },
            select: {
              id: true,
              start: true,
              end: true,
            },
          })

          return res.status(200).json(sleeps)
        } catch (e) {
          console.log(e)
          return res.status(500).json({ error: 'Unexpected error.' })
        }
    }
  }
}

export default handler
