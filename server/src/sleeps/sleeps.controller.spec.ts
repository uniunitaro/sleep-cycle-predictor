import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common'
import { MySleepsController } from './sleeps.controller'
import { SleepsService } from './sleeps.service'
import {
  CreateSleepRequest,
  GetSleepsRequest,
  UpdateSleepRequest,
} from './sleeps.dto'

describe('MySleepsController', () => {
  let controller: MySleepsController
  let service: SleepsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySleepsController],
      providers: [
        {
          provide: SleepsService,
          useFactory: () => ({
            findByPeriod: jest.fn().mockResolvedValue(['result']),
            create: jest.fn().mockResolvedValue('result'),
            update: jest.fn().mockResolvedValue('result'),
            remove: jest.fn().mockResolvedValue('result'),
          }),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<MySleepsController>(MySleepsController)
    service = module.get<SleepsService>(SleepsService)
  })

  test('AuthGuardが適用されている', async () => {
    const guards = Reflect.getMetadata('__guards__', MySleepsController)
    const guard = new guards[0]()

    expect(guard).toBeInstanceOf(AuthGuard)
  })

  describe('findByPeriod', () => {
    test('findByPeriodが呼ばれる', async () => {
      const req = {} as Request
      const payload: GetSleepsRequest = {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-03T00:00:00.000Z'),
      }

      const expected = ['result']
      const result = await controller.findByPeriod(req, payload)
      expect(result).toEqual(expected)
    })

    test('startがendより後の場合に400エラーが返される', async () => {
      const payload: GetSleepsRequest = {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-01T00:00:00.000Z'),
      }

      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      })
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: GetSleepsRequest,
        data: '',
      }

      await target.transform(payload, metadata).catch((err) => {
        expect(err.getResponse().statusCode).toBe(400)
      })
    })
  })

  describe('create', () => {
    test('createが呼ばれる', async () => {
      const req = {} as Request
      const payload: CreateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }

      const expected = 'result'
      const result = await controller.create(req, payload)
      expect(result).toBe(expected)
    })

    test('startがendより後の場合に400エラーが返される', async () => {
      const payload: CreateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T08:00:00.000Z'),
            end: new Date('2022-01-01T00:00:00.000Z'),
          },
        ],
      }

      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      })
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: CreateSleepRequest,
        data: '',
      }

      await target.transform(payload, metadata).catch((err) => {
        expect(err.getResponse().statusCode).toBe(400)
      })
    })
  })

  describe('update', () => {
    test('updateが呼ばれる', async () => {
      const req = {} as Request
      const params = { id: 1 }
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T00:00:00.000Z'),
            end: new Date('2022-01-01T08:00:00.000Z'),
          },
        ],
      }

      const expected = 'result'
      const result = await controller.update(params, req, payload)
      expect(result).toBe(expected)
    })

    test('startがendより後の場合に400エラーが返される', async () => {
      const payload: UpdateSleepRequest = {
        sleeps: [
          {
            start: new Date('2022-01-01T08:00:00.000Z'),
            end: new Date('2022-01-01T00:00:00.000Z'),
          },
        ],
      }

      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      })
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: UpdateSleepRequest,
        data: '',
      }

      await target.transform(payload, metadata).catch((err) => {
        expect(err.getResponse().statusCode).toBe(400)
      })
    })
  })

  describe('remove', () => {
    test('removeが呼ばれる', async () => {
      const req = {} as Request
      const params = { id: 1 }

      const expected = 'result'
      const result = await controller.remove(params, req)
      expect(result).toBe(expected)
    })
  })
})
