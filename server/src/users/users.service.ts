import { Injectable, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from '../prisma/prisma.service'
import {
  GetMeResponse,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
} from './users.type'
import { CreateUserRequest, UpdateUserRequest } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async findMe(req: Request): Promise<GetMeResponse> {
    const authUser = await this.auth.getAuthUser(req)

    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id: authUser.id,
        },
      })
    } catch {
      throw new NotFoundException()
    }
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
        config: { create: {} },
      },
    })
  }

  async update(
    req: Request,
    payload: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const authUser = await this.auth.getAuthUser(req)

    try {
      return await this.prisma.user.update({
        where: {
          id: authUser.id,
        },
        data: {
          email: authUser.email,
          nickname: payload.nickname,
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }

  async remove(req: Request): Promise<void> {
    const authUser = await this.auth.getAuthUser(req)

    try {
      await this.prisma.user.delete({
        where: {
          id: authUser.id,
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }

  async find(id: string): Promise<GetUserResponse> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          id: true,
          nickname: true,
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }
}
