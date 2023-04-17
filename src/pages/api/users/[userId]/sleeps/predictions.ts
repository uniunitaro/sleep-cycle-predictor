import { NextApiHandler } from 'next'
import { getUserFromCookies } from 'next-firebase-auth'
import { PrismaClient } from '@prisma/client'
import { initAuth } from '@/libs/firebase'
import { predictWithLR } from '@/services/predictWithLR'
import { QueryType } from '@/types/utils'

initAuth()

export type GetPredictionsRequest = {
  start: Date
  end: Date
  srcStart: Date
}

export type GetPredictionsResponse = {
  start: string
  end: string
}[]

const handler: NextApiHandler = async (req, res) => {
  const { userId } = req.query
  if (userId === 'me') {
    switch (req.method) {
      case 'GET':
        try {
          const authUser = await getUserFromCookies({ req })
          if (!authUser.id) {
            return res.status(401).json({ error: 'Unauthorized.' })
          }

          const payload = req.query as QueryType<GetPredictionsRequest>
          const prisma = new PrismaClient()

          const sleeps = await prisma.sleep.findMany({
            where: {
              userId: authUser.id,
              start: {
                gte: payload.srcStart,
              },
            },
            orderBy: {
              start: 'asc',
            },
          })

          const start = new Date(payload.start)
          const end = new Date(payload.end)
          const result = predictWithLR(sleeps, start, end)
          // TODO 予測結果をDBに保存する

          return res.status(200).json(result)
        } catch (e) {
          console.log(e)
          return res.status(500).json({ error: 'Unexpected error.' })
        }
    }
  }
}

export default handler
