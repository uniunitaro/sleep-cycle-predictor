import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { predictWithLR } from 'src/utils/predictWithLR'
import {
  GetMyPredictionsRequest,
  GetSleepsRequest,
  PostSleepRequest,
} from './sleeps.dto'
import {
  GetPredictionsResponse,
  GetSleepsResponse,
  PostSleepResponse,
} from './sleeps.type'

@Injectable()
export class SleepsService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async getSleeps(
    req: Request,
    payload: GetSleepsRequest,
  ): Promise<GetSleepsResponse> {
    console.time('getSleeps: Service')
    const authUser = await this.auth.getAuthUser(req)
    const sleeps = await this.prisma.sleep.findMany({
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
    console.timeEnd('getSleeps: Service')
    return sleeps
  }

  async postSleep(
    req: Request,
    payload: PostSleepRequest,
  ): Promise<PostSleepResponse> {
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

  async getMyPredictions(
    req: Request,
    payload: GetMyPredictionsRequest,
  ): Promise<GetPredictionsResponse> {
    const authUser = await this.auth.getAuthUser(req)

    const sleeps = await this.prisma.sleep.findMany({
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

    return predictWithLR(sleeps, payload.start, payload.end)
  }
}
