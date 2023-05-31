import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { ConfigFactory, SleepFactory, UserFactory } from 'src/test/factories'
import { ConflictException } from '@nestjs/common'
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

      const user = await UserFactory.createForConnect({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })
      const sleeps = await SleepFactory.createList([
        {
          user: { connect: user },
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
        {
          user: { connect: user },
          start: new Date('2022-01-02T00:00:00.000Z'),
          end: new Date('2022-01-02T08:00:00.000Z'),
        },
        {
          user: { connect: user },
          start: new Date('2022-01-03T00:00:00.000Z'),
          end: new Date('2022-01-03T08:00:00.000Z'),
        },
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

      await UserFactory.create({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      const sleep = await service.create(req, payload)
      expect(sleep.start).toEqual(payload.start)
      expect(sleep.end).toEqual(payload.end)
    })

    test('既存のSleepと重複する場合は409エラーが返される', async () => {
      const req = {} as Request

      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      await SleepFactory.create({
        user: { connect: user },
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const payload1: CreateSleepRequest = {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      }
      await expect(service.create(req, payload1)).rejects.toThrowError(
        ConflictException,
      )

      const payload2: CreateSleepRequest = {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T04:00:00.000Z'),
      }
      await expect(service.create(req, payload2)).rejects.toThrowError(
        ConflictException,
      )

      const payload3: CreateSleepRequest = {
        start: new Date('2022-01-01T04:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      }
      await expect(service.create(req, payload3)).rejects.toThrowError(
        ConflictException,
      )

      const payload4: CreateSleepRequest = {
        start: new Date('2022-01-01T04:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      }
      await expect(service.create(req, payload4)).rejects.toThrowError(
        ConflictException,
      )
    })
  })
})
