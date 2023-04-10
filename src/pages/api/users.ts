import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { verifyIdToken } from 'next-firebase-auth'

export type CreateUserRequest = {
  nickname: string
}

export type CreateUserResponse = {
  nickname: string
  email?: string
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      try {
        const user = await verifyIdToken(req.headers.authorization ?? '')
        if (!user.id) {
          throw new Error('User ID is null.')
        }

        const payload = req.body as CreateUserRequest
        const prisma = new PrismaClient()
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            nickname: payload.nickname,
          },
        })

        const userResponse: CreateUserResponse = {
          nickname: payload.nickname,
          email: user.email ?? undefined,
        }
        return res.status(200).json(userResponse)
      } catch {
        return res.status(500).json({ error: 'Unexpected error.' })
      }
  }
}

export default handler
