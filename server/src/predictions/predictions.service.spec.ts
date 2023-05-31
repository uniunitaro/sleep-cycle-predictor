import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { ConfigFactory, SleepFactory, UserFactory } from 'src/test/factories'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import { PredictionsService } from './predictions.service'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from './predictions.dto'

jest.mock('./utils/getSrcStart', () => ({
  getSrcStart: jest
    .fn()
    .mockResolvedValue(new Date('2022-01-01T00:00:00.000Z')),
}))

describe('PredictionsService', () => {
  let service: PredictionsService
  let prismaService: PrismaService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictionsService,
        {
          provide: PrismaService,
          useValue: jestPrisma.client,
        },
        AuthService,
      ],
    }).compile()

    service = module.get<PredictionsService>(PredictionsService)
    prismaService = module.get<PrismaService>(PrismaService)
    authService = module.get<AuthService>(AuthService)
  })

  describe('getMyPredictions', () => {
    test('予測睡眠データの配列が返される', async () => {
      const req = {} as Request
      const payload: GetMyPredictionsRequest = {
        start: new Date('2022-01-04T00:00:00.000Z'),
        end: new Date('2022-01-05T00:00:00.000Z'),
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      await UserFactory.create({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
        sleeps: {
          create: await SleepFactory.buildList([
            {
              start: new Date('2022-01-02T00:00:00.000Z'),
              end: new Date('2022-01-02T08:00:00.000Z'),
            },
            {
              start: new Date('2022-01-03T01:00:00.000Z'),
              end: new Date('2022-01-03T09:00:00.000Z'),
            },
          ]),
        },
      })

      const result = await service.getMyPredictions(req, payload)

      expect(result).toHaveLength(1)
    })
  })

  describe('getPredictions', () => {
    test('予測睡眠データの配列が返される', async () => {
      const userId = '1'
      const payload: GetPredictionsRequest = {
        start: new Date('2022-01-04T00:00:00.000Z'),
        end: new Date('2022-01-05T00:00:00.000Z'),
      }
      await UserFactory.create({
        id: userId,
        config: { create: await ConfigFactory.build() },
        sleeps: {
          create: await SleepFactory.buildList([
            {
              start: new Date('2022-01-02T00:00:00.000Z'),
              end: new Date('2022-01-02T08:00:00.000Z'),
            },
            {
              start: new Date('2022-01-03T01:00:00.000Z'),
              end: new Date('2022-01-03T09:00:00.000Z'),
            },
          ]),
        },
      })

      const result = await service.getPredictions(userId, payload)

      expect(result).toHaveLength(1)
    })
  })
})
