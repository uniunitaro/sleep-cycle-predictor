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
    test('createが呼ばれる', async () => {
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
    test('findが呼ばれる', async () => {
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
            update: jest.fn().mockResolvedValue('result'),
            remove: jest.fn().mockResolvedValue('result'),
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

  test('AuthGuardが適用されている', async () => {
    const guards = Reflect.getMetadata('__guards__', MeController)
    const guard = new guards[0]()

    expect(guard).toBeInstanceOf(AuthGuard)
  })

  describe('findMe', () => {
    test('findMeが呼ばれる', async () => {
      const req = {} as Request

      const expected = 'result'
      const result = await controller.findMe(req)
      expect(result).toBe(expected)
    })
  })

  describe('update', () => {
    test('updateが呼ばれる', async () => {
      const req = {} as Request
      const payload = {
        nickname: 'testuser',
      }

      const expected = 'result'
      const result = await controller.update(req, payload)
      expect(result).toBe(expected)
    })
  })

  describe('remove', () => {
    test('removeが呼ばれる', async () => {
      const req = {} as Request

      const expected = 'result'
      const result = await controller.remove(req)
      expect(result).toBe(expected)
    })
  })
})
