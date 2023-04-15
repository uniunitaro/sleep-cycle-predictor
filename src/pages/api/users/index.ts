import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { verifyIdToken } from 'next-firebase-auth'
import { initAuth } from '@/libs/firebase'

initAuth()

export type PostUserRequest = {
  nickname: string
}

export type PostUserResponse = {
  nickname: string
  email?: string
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      try {
        const authUser = await verifyIdToken(req.headers.authorization ?? '')
        if (!authUser.id) {
          return res.status(401).json({ error: 'Unauthorized.' })
        }

        const payload = req.body as PostUserRequest
        const prisma = new PrismaClient()
        const user = await prisma.user.create({
          data: {
            id: authUser.id,
            email: authUser.email,
            nickname: payload.nickname,
          },
        })

        const userResponse: PostUserResponse = {
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
