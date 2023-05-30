import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import { SleepsService } from './sleeps.service'
import { GetSleepsRequest, CreateSleepRequest } from './sleeps.dto'

describe('SleepsService', () => {
  let service: SleepsService
  let prismaService: PrismaService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SleepsService,
        {
          provide: PrismaService,
          useValue: jestPrisma.client,
        },
        AuthService,
      ],
    }).compile()

    service = module.get<SleepsService>(SleepsService)
    prismaService = module.get<PrismaService>(PrismaService)
    authService = module.get<AuthService>(AuthService)
  })

  describe('findByPeriod', () => {
    test('指定した期間のSleepの配列が返される', async () => {
      const req = {} as Request
      const payload: GetSleepsRequest = {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-03T00:00:00.000Z'),
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const sleeps = await Promise.all([
        prismaService.sleep.create({
          data: {
            userId: authUser.id,
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        }),
        prismaService.sleep.create({
          data: {
            userId: authUser.id,
            start: new Date('2022-01-02T00:00:00.000Z'),
            end: new Date('2022-01-02T08:00:00.000Z'),
          },
        }),
        prismaService.sleep.create({
          data: {
            userId: authUser.id,
            start: new Date('2022-01-03T00:00:00.000Z'),
            end: new Date('2022-01-03T08:00:00.000Z'),
          },
        }),
      ])

      const result = await service.findByPeriod(req, payload)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual(sleeps[1].id)
      expect(result[0].start).toEqual(sleeps[1].start)
      expect(result[0].end).toEqual(sleeps[1].end)
    })
  })

  describe('create', () => {
    test('Sleepレコードが作成される', async () => {
      const req = {} as Request
      const payload: CreateSleepRequest = {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const sleep = await service.create(req, payload)
      expect(sleep.start).toEqual(payload.start)
      expect(sleep.end).toEqual(payload.end)
    })
  })
})
