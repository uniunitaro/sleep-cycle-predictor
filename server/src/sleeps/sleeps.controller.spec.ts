import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { MySleepsController } from './sleeps.controller'
import { SleepsService } from './sleeps.service'
import { CreateSleepRequest, GetSleepsRequest } from './sleeps.dto'

jest.mock('../auth/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    getAuthUser: jest.fn(),
  })),
}))

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
            findByPeriod: jest.fn(),
            create: jest.fn(),
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

  describe('findByPeriod', () => {
    test('findByPeriodが正しく呼ばれる', async () => {
      const req = {} as Request
      const payload: GetSleepsRequest = {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-03T00:00:00.000Z'),
      }
      const expected = ['result']
      jest.spyOn(service, 'findByPeriod').mockResolvedValue(expected as any)

      const result = await controller.findByPeriod(req, payload)

      expect(result).toEqual(expected)
    })
  })

  describe('create', () => {
    test('createが正しく呼ばれる', async () => {
      const req = {} as Request
      const payload: CreateSleepRequest = {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      }
      const expected = 'result'
      jest.spyOn(service, 'create').mockResolvedValue(expected as any)

      const result = await controller.create(req, payload)

      expect(result).toEqual(expected)
    })
  })
})
