import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './users.service'
import { PostUserRequest } from './users.dto'

@Controller('users/me')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getMe(@Req() req: Request) {
    return this.userService.getMe(req)
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Req() req: Request, @Query() payload: PostUserRequest) {
    return this.userService.createUser(req, payload)
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId)
  }
}
