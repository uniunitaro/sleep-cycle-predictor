import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common'
import {
  setAuthCookies,
  getUserFromCookies,
  AuthUser,
  unsetAuthCookies,
  verifyIdToken,
} from 'next-firebase-auth'
import { initAuth } from 'src/libs/firebase'
import { Request, Response } from 'express'

@Injectable()
export class AuthService implements OnModuleInit {
  onModuleInit() {
    initAuth()
  }

  async setAuthCookies(req: Request, res: Response) {
    try {
      await setAuthCookies(req as any, res as any)
    } catch {
      throw new InternalServerErrorException()
    }
  }

  async unsetAuthCookies(req: Request, res: Response) {
    try {
      await unsetAuthCookies(req as any, res as any)
    } catch {
      throw new InternalServerErrorException()
    }
  }

  async getAuthUser(req: Request) {
    const user = await getUserFromCookies({ req: req as any })
    if (!user.id) {
      throw new UnauthorizedException()
    }
    return user as AuthUser & { id: string }
  }

  async verifyIdToken(token: string) {
    const user = await verifyIdToken(token)
    if (!user.id) {
      throw new UnauthorizedException()
    }
    return user as AuthUser & { id: string }
  }
}
