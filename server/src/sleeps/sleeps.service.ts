import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { areIntervalsOverlapping, getUnixTime } from 'date-fns'
import {
  GetSleepsRequest,
  CreateSleepRequest,
  UpdateSleepRequest,
} from './sleeps.dto'
import {
  GetSleepsResponse,
  CreateSleepResponse,
  UpdateSleepResponse,
} from './sleeps.type'

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
      include: {
        segmentedSleeps: {
          orderBy: {
            start: 'asc',
          },
        },
      },
    })
  }

  async create(
    req: Request,
    payload: CreateSleepRequest,
  ): Promise<CreateSleepResponse> {
    const authUser = await this.auth.getAuthUser(req)
    await this.checkOverlap(authUser.id, payload)

    const { firstSleep, segmentedSleeps } = this.getSleepAndSegmentedSleeps(
      payload.sleeps,
    )

    return this.prisma.sleep.create({
      data: {
        userId: authUser.id,
        start: firstSleep.start,
        end: firstSleep.end,
        segmentedSleeps: { createMany: { data: segmentedSleeps } },
      },
      include: {
        segmentedSleeps: {
          orderBy: {
            start: 'asc',
          },
        },
      },
    })
  }

  async update(
    id: number,
    req: Request,
    payload: UpdateSleepRequest,
  ): Promise<UpdateSleepResponse> {
    const authUser = await this.auth.getAuthUser(req)

    const sleep = await this.prisma.sleep.findUnique({
      where: {
        id,
      },
    })
    if (!sleep) {
      throw new NotFoundException()
    }
    if (sleep.userId !== authUser.id) {
      throw new ForbiddenException()
    }

    await this.checkOverlap(authUser.id, payload, id)

    const { firstSleep, segmentedSleeps } = this.getSleepAndSegmentedSleeps(
      payload.sleeps,
    )

    return await this.prisma.sleep.update({
      where: {
        id,
      },
      data: {
        start: firstSleep.start,
        end: firstSleep.end,
        segmentedSleeps: {
          deleteMany: {},
          createMany: {
            data: segmentedSleeps,
          },
        },
      },
      include: {
        segmentedSleeps: {
          orderBy: {
            start: 'asc',
          },
        },
      },
    })
  }

  async remove(id: number, req: Request): Promise<void> {
    const authUser = await this.auth.getAuthUser(req)

    const sleep = await this.prisma.sleep.findUnique({
      where: {
        id,
      },
    })
    if (!sleep) {
      throw new NotFoundException()
    }
    if (sleep.userId !== authUser.id) {
      throw new ForbiddenException()
    }

    this.prisma.sleep.delete({
      where: {
        id,
      },
    })
  }

  private async checkOverlap(
    userId: string,
    payload: CreateSleepRequest,
    existingSleepId?: number,
  ) {
    // 既存のSleepと重複していないかチェック
    const sleeps = await this.prisma.sleep.findMany({
      where: {
        userId: userId,
        NOT: {
          id: existingSleepId,
        },
        OR: [
          ...payload.sleeps.flatMap((sleep) => [
            {
              start: {
                lte: sleep.start,
              },
              end: {
                gte: sleep.start,
              },
            },
            {
              start: {
                lte: sleep.end,
              },
              end: {
                gte: sleep.end,
              },
            },
            {
              start: {
                gte: sleep.start,
              },
              end: {
                lte: sleep.end,
              },
            },
          ]),
        ],
      },
    })
    if (sleeps.length > 0) {
      throw new ConflictException('既に記録されている睡眠と重複しています。')
    }

    // 既存のSegmentedSleepと重複していないかチェック
    const allSleeps = await this.prisma.sleep.findMany({
      where: {
        userId,
        NOT: {
          id: existingSleepId,
        },
      },
    })
    const segmentedSleeps = await this.prisma.segmentedSleep.findMany({
      where: {
        sleepId: {
          in: allSleeps.map((sleep) => sleep.id),
        },
        OR: [
          ...payload.sleeps.flatMap((sleep) => [
            {
              start: {
                lte: sleep.start,
              },
              end: {
                gte: sleep.start,
              },
            },
            {
              start: {
                lte: sleep.end,
              },
              end: {
                gte: sleep.end,
              },
            },
            {
              start: {
                gte: sleep.start,
              },
              end: {
                lte: sleep.end,
              },
            },
          ]),
        ],
      },
    })
    if (segmentedSleeps.length > 0) {
      throw new ConflictException('既に記録されている睡眠と重複しています。')
    }

    // リクエスト内のSleepとSegmentedSleepが重複していないかチェック
    const hasOverlappingSleeps = (sleeps: { start: Date; end: Date }[]) => {
      return sleeps.some((current, i) => {
        return sleeps.slice(i + 1).some((compare) => {
          return areIntervalsOverlapping(current, compare)
        })
      })
    }
    if (hasOverlappingSleeps(payload.sleeps)) {
      throw new ConflictException('睡眠が重複しています。')
    }
  }

  private getSleepAndSegmentedSleeps(sleeps: { start: Date; end: Date }[]) {
    const sortedSleeps = [...sleeps].sort(
      (a, b) => getUnixTime(a.start) - getUnixTime(b.start),
    )
    const [firstSleep, ...segmentedSleeps] = sortedSleeps
    return { firstSleep, segmentedSleeps }
  }
}
