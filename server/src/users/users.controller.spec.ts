import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { UsersController, MeController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserRequest } from './users.dto'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn().mockResolvedValue('result'),
            find: jest.fn().mockResolvedValue('result'),
          }),
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  describe('create', () => {
    test('createが正しく呼ばれる', async () => {
      const req = {} as Request
      const payload: CreateUserRequest = {
        nickname: 'testuser',
      }

      const expected = 'result'
      const result = await controller.create(req, payload)
      expect(result).toBe(expected)
    })
  })

  describe('find', () => {
    test('findが正しく呼ばれる', async () => {
      const userId = '123'

      const expected = 'result'
      const result = await controller.find(userId)
      expect(result).toBe(expected)
    })
  })
})

describe('MeController', () => {
  let controller: MeController
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findMe: jest.fn().mockResolvedValue('result'),
          }),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<MeController>(MeController)
    service = module.get<UsersService>(UsersService)
  })

  describe('findMe', () => {
    test('findMeが呼ばれる', async () => {
      const req = {} as Request

      const expected = 'result'
      const result = await controller.findMe(req)
      expect(result).toBe(expected)
    })
  })
})
