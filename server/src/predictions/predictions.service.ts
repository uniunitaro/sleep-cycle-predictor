import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthService } from 'src/auth/auth.service'
import { Request } from 'express'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from './predictions.dto'
import { GetPredictionsResponse } from './predictions.type'
import { predictWithLR } from './utils/predictWithLR'
import { getSrcStart } from './utils/getSrcStart'

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async getMyPredictions(
    req: Request,
    payload: GetMyPredictionsRequest,
  ): Promise<GetPredictionsResponse> {
    const authUser = await this.auth.getAuthUser(req)

    const config = await this.prisma.config.findUnique({
      where: {
        userId: authUser.id,
      },
    })
    if (!config) {
      throw new NotFoundException()
    }

    const srcStart = await getSrcStart(config.predictionSrcDuration)

    const sleeps = await this.prisma.sleep.findMany({
      where: {
        userId: authUser.id,
        start: {
          gte: srcStart,
        },
      },
      orderBy: {
        start: 'asc',
      },
      include: {
        segmentedSleeps: {
          orderBy: {
            start: 'asc',
          },
        },
      },
    })

    return predictWithLR(sleeps, payload.start, payload.end)
  }

  async getPredictions(
    userId: string,
    payload: GetPredictionsRequest,
  ): Promise<GetPredictionsResponse> {
    const config = await this.prisma.config.findUnique({
      where: {
        userId: userId,
      },
    })
    if (!config) {
      throw new NotFoundException()
    }

    const srcStart = await getSrcStart(config.predictionSrcDuration)

    const sleeps = await this.prisma.sleep.findMany({
      where: {
        userId,
        start: {
          gte: srcStart,
        },
      },
      orderBy: {
        start: 'asc',
      },
      include: {
        segmentedSleeps: {
          orderBy: {
            start: 'asc',
          },
        },
      },
    })

    return predictWithLR(sleeps, payload.start, payload.end)
  }
}
