import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from './predictions.dto'
import {
  PredictionsController,
  MyPredictionsController,
} from './predictions.controller'
import { PredictionsService } from './predictions.service'

describe('PredictionsController', () => {
  let controller: PredictionsController
  let service: PredictionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsController],
      providers: [
        {
          provide: PredictionsService,
          useFactory: () => ({
            get: jest.fn().mockResolvedValue(['result']),
          }),
        },
      ],
    }).compile()

    controller = module.get<PredictionsController>(PredictionsController)
    service = module.get<PredictionsService>(PredictionsService)
  })

  describe('getPredictions', () => {
    test('getが呼ばれる', async () => {
      const userId = '123'
      const getPredictionsRequest: GetPredictionsRequest = {
        start: new Date(),
        end: new Date(),
      }

      const expected = ['result']
      const result = await controller.getPredictions(
        userId,
        getPredictionsRequest,
      )
      expect(result).toEqual(expected)
    })
  })
})

describe('MyPredictionsController', () => {
  let controller: MyPredictionsController
  let service: PredictionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyPredictionsController],
      providers: [
        {
          provide: PredictionsService,
          useFactory: () => ({
            getMyPredictions: jest.fn().mockResolvedValue(['result']),
          }),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<MyPredictionsController>(MyPredictionsController)
    service = module.get<PredictionsService>(PredictionsService)
  })

  test('AuthGuardが適用されている', async () => {
    const guards = Reflect.getMetadata('__guards__', MyPredictionsController)
    const guard = new guards[0]()

    expect(guard).toBeInstanceOf(AuthGuard)
  })

  describe('getPredictions', () => {
    test('getMyPredictionsが呼ばれる', async () => {
      const req: Request = { user: { id: '123' } } as any
      const getMyPredictionsRequest: GetMyPredictionsRequest = {
        start: new Date(),
        end: new Date(),
      }

      const expected = ['result']
      const result = await controller.getPredictions(
        req,
        getMyPredictionsRequest,
      )
      expect(result).toEqual(expected)
    })
  })
})
