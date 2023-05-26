import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from '../prisma/prisma.service'
import {
  GetMeResponse,
  GetUserResponse,
  CreateUserResponse,
} from './users.type'
import { CreateUserRequest } from './users.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async findMe(req: Request): Promise<GetMeResponse | null> {
    const authUser = await this.auth.getAuthUser(req)

    return this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    })
  }

  async create(
    req: Request,
    payload: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const authUser = await this.auth.verifyIdToken(
      req.headers.authorization ?? '',
    )

    return this.prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        nickname: payload.nickname,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    })
  }

  async find(userId: string): Promise<GetUserResponse | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nickname: true,
      },
    })
  }
}
