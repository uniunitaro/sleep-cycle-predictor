import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import {
  ConfigFactory,
  SegmentedSleepFactory,
  SleepFactory,
  UserFactory,
} from 'src/test/factories'
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import { SleepsService } from './sleeps.service'
import {
  GetSleepsRequest,
  CreateSleepRequest,
  UpdateSleepRequest,
} from './sleeps.dto'

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
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-02T10:00:00.000Z'),
              end: new Date('2022-01-02T11:00:00.000Z'),
            }),
          },
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

      expect(result[0].segmentedSleeps).toHaveLength(1)
      expect(result[0].segmentedSleeps[0].start).toEqual(
        new Date('2022-01-02T10:00:00.000Z'),
      )
      expect(result[0].segmentedSleeps[0].end).toEqual(
        new Date('2022-01-02T11:00:00.000Z'),
      )
    })
  })

  const testCases = [
    [
      new Date('2022-01-01T02:00:00.000Z'),
      new Date('2022-01-01T06:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T00:00:00.000Z'),
      new Date('2022-01-01T08:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T00:00:00.000Z'),
      new Date('2022-01-01T04:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T04:00:00.000Z'),
      new Date('2022-01-01T08:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T04:00:00.000Z'),
      new Date('2022-01-01T06:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T00:00:00.000Z'),
      new Date('2022-01-01T02:00:00.000Z'),
    ],
    [
      new Date('2022-01-01T06:00:00.000Z'),
      new Date('2022-01-01T08:00:00.000Z'),
    ],
  ]

  describe('create', () => {
    test('Sleepレコードが作成される', async () => {
      const req = {} as Request
      const payload: CreateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T10:00:00.000Z'),
            end: new Date('2022-01-01T11:00:00.000Z'),
          },
        ],
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      await UserFactory.create({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      const sleep = await service.create(req, payload)
      expect(sleep.start).toEqual(payload.sleeps[0].start)
      expect(sleep.end).toEqual(payload.sleeps[0].end)

      expect(sleep.segmentedSleeps).toHaveLength(1)
      expect(sleep.segmentedSleeps[0].start).toEqual(payload.sleeps[1].start)
      expect(sleep.segmentedSleeps[0].end).toEqual(payload.sleeps[1].end)
    })

    test('リクエストのSleepsが昇順に並び替えられて、最早のものがSleepに、それ以外がSegmentedSleepsとして作成される', async () => {
      const req = {} as Request
      const payload: CreateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T13:00:00.000Z'),
            end: new Date('2022-01-01T15:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T10:00:00.000Z'),
            end: new Date('2022-01-01T11:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      await UserFactory.create({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      const sleep = await service.create(req, payload)
      expect(sleep.start).toEqual(payload.sleeps[2].start)
      expect(sleep.end).toEqual(payload.sleeps[2].end)

      expect(sleep.segmentedSleeps).toHaveLength(2)
      expect(sleep.segmentedSleeps[0].start).toEqual(payload.sleeps[1].start)
      expect(sleep.segmentedSleeps[0].end).toEqual(payload.sleeps[1].end)
      expect(sleep.segmentedSleeps[1].start).toEqual(payload.sleeps[0].start)
      expect(sleep.segmentedSleeps[1].end).toEqual(payload.sleeps[0].end)
    })

    describe('Sleepが既存のSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })

    describe('Sleepが既存のSegmentedSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })

    describe('SegmentedSleepが既存のSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-12-01T00:00:00.000Z'),
              end: new Date('2021-12-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })

    describe('SegmentedSleepが既存のSegmentedSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-05-01T00:00:00.000Z'),
              end: new Date('2021-05-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })

    describe('SleepとSegmentedSleepが重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        await UserFactory.create({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2022-01-01T00:00:00.000Z'),
              end: new Date('2022-01-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })

    describe('SegmentedSleep同士が重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        await UserFactory.create({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-12-01T00:00:00.000Z'),
              end: new Date('2021-12-01T08:00:00.000Z'),
            },
            {
              start: new Date('2022-01-01T00:00:00.000Z'),
              end: new Date('2022-01-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(service.create(req, payload)).rejects.toThrowError(
          ConflictException,
        )
      })
    })
  })

  describe('update', () => {
    test('Sleepが更新される', async () => {
      const req = {} as Request
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T10:00:00.000Z'),
            end: new Date('2022-01-01T11:00:00.000Z'),
          },
        ],
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })
      const sleep = await SleepFactory.create({
        user: { connect: user },
      })

      const result = await service.update(sleep.id, req, payload)
      expect(result.start).toEqual(payload.sleeps[0].start)
      expect(result.end).toEqual(payload.sleeps[0].end)

      expect(result.segmentedSleeps).toHaveLength(1)
      expect(result.segmentedSleeps[0].start).toEqual(payload.sleeps[1].start)
      expect(result.segmentedSleeps[0].end).toEqual(payload.sleeps[1].end)
    })

    test('Sleepが見つからないときはエラーが返される', () => {
      const req = {} as Request
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }

      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      return expect(service.update(1, req, payload)).rejects.toThrowError(
        NotFoundException,
      )
    })

    test('Sleepが他のユーザーのもののときはエラーが返される', async () => {
      const req = {} as Request
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }

      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: '2',
        config: { create: await ConfigFactory.build() },
      })
      const sleep = await SleepFactory.create({
        user: { connect: user },
      })

      return expect(
        service.update(sleep.id, req, payload),
      ).rejects.toThrowError(ForbiddenException)
    })

    test('リクエストのSleepsが昇順に並び替えられて、最早のものがSleepに、それ以外がSegmentedSleepsとして作成される', async () => {
      const req = {} as Request
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T13:00:00.000Z'),
            end: new Date('2022-01-01T15:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T10:00:00.000Z'),
            end: new Date('2022-01-01T11:00:00.000Z'),
          },
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      const sleep = await SleepFactory.create({
        user: { connect: user },
      })

      const result = await service.update(sleep.id, req, payload)
      expect(result.start).toEqual(payload.sleeps[2].start)
      expect(result.end).toEqual(payload.sleeps[2].end)

      expect(result.segmentedSleeps).toHaveLength(2)
      expect(result.segmentedSleeps[0].start).toEqual(payload.sleeps[1].start)
      expect(result.segmentedSleeps[0].end).toEqual(payload.sleeps[1].end)
      expect(result.segmentedSleeps[1].start).toEqual(payload.sleeps[0].start)
      expect(result.segmentedSleeps[1].end).toEqual(payload.sleeps[0].end)
    })

    describe('Sleepが既存のSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
        })

        const payload: UpdateSleepRequest = {
          sleeps: [
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).rejects.toThrowError(ConflictException)
      })
    })

    describe('Sleepが既存のSegmentedSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
        })

        const payload: UpdateSleepRequest = { sleeps: [{ start, end }] }
        await expect(
          service.update(sleep.id, req, payload),
        ).rejects.toThrowError(ConflictException)
      })
    })

    describe('SegmentedSleepが既存のSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-12-01T00:00:00.000Z'),
              end: new Date('2021-12-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).rejects.toThrowError(ConflictException)
      })
    })

    describe('SegmentedSleepが既存のSegmentedSleepと重複する場合は409エラーが返される', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
        })

        const payload: CreateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-05-01T00:00:00.000Z'),
              end: new Date('2021-05-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).rejects.toThrowError(ConflictException)
      })
    })

    describe('更新前のSleepが更新後のSleepと重複する場合に誤ってエラーが返されない', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const payload: UpdateSleepRequest = {
          sleeps: [
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).resolves.not.toThrow()
      })
    })

    describe('更新前のSleepが更新後のSegmentedSleepと重複する場合に誤ってエラーが返されない', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
        })

        const payload: UpdateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-12-01T00:00:00.000Z'),
              end: new Date('2021-12-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).resolves.not.toThrow()
      })
    })

    describe('更新前のSegmentedSleepが更新後のSleepと重複する場合に誤ってエラーが返されない', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const payload: UpdateSleepRequest = {
          sleeps: [
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).resolves.not.toThrow()
      })
    })

    describe('更新前のSegmentedSleepが更新後のSegmentedSleepと重複する場合に誤ってエラーが返されない', () => {
      test.each(testCases)('start: %p, end: %p', async (start, end) => {
        const req = {} as Request
        const authUser = { id: '1' }
        jest
          .spyOn(authService, 'getAuthUser')
          .mockResolvedValue(authUser as any)

        const user = await UserFactory.createForConnect({
          id: authUser.id,
          config: { create: await ConfigFactory.build() },
        })

        await SleepFactory.create({
          user: { connect: user },
        })

        const sleep = await SleepFactory.create({
          user: { connect: user },
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
          segmentedSleeps: {
            create: await SegmentedSleepFactory.build({
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            }),
          },
        })

        const payload: UpdateSleepRequest = {
          sleeps: [
            {
              start: new Date('2021-12-01T00:00:00.000Z'),
              end: new Date('2021-12-01T08:00:00.000Z'),
            },
            {
              start,
              end,
            },
          ],
        }
        await expect(
          service.update(sleep.id, req, payload),
        ).resolves.not.toThrow()
      })
    })
  })

  describe('remove', () => {
    test('Sleepが削除される', async () => {
      const req = {} as Request
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: authUser.id,
        config: { create: await ConfigFactory.build() },
      })

      const sleep = await SleepFactory.create({
        user: { connect: user },
      })

      await expect(service.remove(sleep.id, req)).resolves.not.toThrow()
    })

    test('Sleepが見つからないときはエラーが返される', () => {
      const req = {} as Request
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      return expect(service.remove(1, req)).rejects.toThrowError(
        NotFoundException,
      )
    })

    test('Sleepが他のユーザーのもののときはエラーが返される', async () => {
      const req = {} as Request
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await UserFactory.createForConnect({
        id: '2',
        config: { create: await ConfigFactory.build() },
      })
      const sleep = await SleepFactory.create({
        user: { connect: user },
      })

      return expect(service.remove(sleep.id, req)).rejects.toThrowError(
        ForbiddenException,
      )
    })
  })
})
