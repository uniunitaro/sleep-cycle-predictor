import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetSleepsRequest, CreateSleepRequest } from './sleeps.dto'
import { GetSleepsResponse, CreateSleepResponse } from './sleeps.type'

@Injectable()
export class SleepsService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async findByPeriod(
    req: Request,
    payload: GetSleepsRequest,
  ): Promise<GetSleepsResponse> {
    const authUser = await this.auth.getAuthUser(req)

    return this.prisma.sleep.findMany({
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
  }

  async create(
    req: Request,
    payload: CreateSleepRequest,
  ): Promise<CreateSleepResponse> {
    const authUser = await this.auth.getAuthUser(req)

    return this.prisma.sleep.create({
      data: {
        userId: authUser.id,
        start: payload.start,
        end: payload.end,
      },
      select: {
        id: true,
        start: true,
        end: true,
      },
    })
  }
}
