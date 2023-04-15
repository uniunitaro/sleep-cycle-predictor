import { PrismaClient, Sleep } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getUserFromCookies } from 'next-firebase-auth'
import { initAuth } from '@/libs/firebase'

initAuth()

export type PostSleepRequest = {
  start: string
  end: string
}

export type PostSleepResponse = {
  id: number
  start: string
  end: string
}

export type GetSleepsRequest = {
  start: string
  end: string
}

export type GetSleepsResponse = Sleep[]

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

          const payload = req.body as PostSleepRequest
          const prisma = new PrismaClient()
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

          const payload = req.query as GetSleepsRequest
          const prisma = new PrismaClient()
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
