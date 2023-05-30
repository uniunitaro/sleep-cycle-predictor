import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import { UsersService } from './users.service'
import { CreateUserRequest } from './users.dto'

describe('UserService', () => {
  let service: UsersService
  let prismaService: PrismaService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: jestPrisma.client,
        },
        AuthService,
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prismaService = module.get<PrismaService>(PrismaService)
    authService = module.get<AuthService>(AuthService)
  })

  describe('findMe', () => {
    test('Userが見つからなかったらエラーを返す', async () => {
      const req = {} as Request
      const authUser = { id: 'invalid-id' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      await expect(service.findMe(req)).rejects.toThrow()
    })

    test('Userが見つかったらUserを返す', async () => {
      const req = {} as Request
      const authUser = { id: '1' }
      jest.spyOn(authService, 'getAuthUser').mockResolvedValue(authUser as any)

      const user = await prismaService.user.create({
        data: {
          id: authUser.id,
          email: 'testuser@example.com',
          nickname: 'testuser',
        },
      })

      const result = await service.findMe(req)
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      })
    })
  })

  describe('create', () => {
    test('Userレコードが作成される', async () => {
      const req = { headers: { authorization: '' } } as Request
      const authUser = { id: '1', email: 'testuser@example.com' }
      jest
        .spyOn(authService, 'verifyIdToken')
        .mockResolvedValue(authUser as any)

      const payload: CreateUserRequest = { nickname: 'testuser' }
      const result = await service.create(req, payload)
      expect(result).toEqual({
        id: expect.any(String),
        nickname: 'testuser',
        email: expect.any(String),
      })
    })
  })

  describe('find', () => {
    test('Userが見つからなかったらエラーを返す', async () => {
      await expect(service.find('invalid-id')).rejects.toThrow()
    })

    test('Userが見つかったらUserを返す', async () => {
      const user = await prismaService.user.create({
        data: {
          id: '1',
          email: 'testuser@example.com',
          nickname: 'testuser',
        },
      })

      const result = await service.find(user.id)
      expect(result).toEqual({
        id: user.id,
        nickname: user.nickname,
      })
    })
  })
})
