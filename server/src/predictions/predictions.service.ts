import { Injectable } from '@nestjs/common'
import { predictWithLR } from 'src/utils/predictWithLR'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthService } from 'src/auth/auth.service'
import { Request } from 'express'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from './predictions.dto'
import { GetPredictionsResponse } from './predictions.type'

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

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

  async getPredictions(
    userId: string,
    payload: GetPredictionsRequest,
  ): Promise<GetPredictionsResponse> {
    const sleeps = await this.prisma.sleep.findMany({
      where: {
        userId,
        start: {
          // TODO 本来はsrcStartをユーザー情報に持たせる
          gte: new Date(2023, 2, 1),
        },
      },
      orderBy: {
        start: 'asc',
      },
    })

    return predictWithLR(sleeps, payload.start, payload.end)
  }
}
