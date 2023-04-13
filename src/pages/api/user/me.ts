import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getUserFromCookies } from 'next-firebase-auth'

export type GetMeResponse = {
  nickname: string
  email?: string
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const authUser = await getUserFromCookies({ req })
        if (!authUser.id) {
          return res.status(401).json({ error: 'Unauthorized.' })
        }

        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
          where: {
            id: authUser.id,
          },
        })
        if (!user) {
          throw new Error('User not found.')
        }

        const userResponse: GetMeResponse = {
          nickname: user.nickname,
          email: user.email ?? undefined,
        }
        return res.status(200).json(userResponse)
      } catch {
        return res.status(500).json({ error: 'Unexpected error.' })
      }
  }
}

export default handler
