import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserService } from './users.service'
import { CreateUserRequest } from './users.dto'

@UseGuards(AuthGuard)
@Controller('users/me')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@Req() req: Request) {
    return this.userService.findMe(req)
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Req() req: Request, @Query() payload: CreateUserRequest) {
    return this.userService.create(req, payload)
  }

  @Get(':userId')
  async find(@Param('userId') userId: string) {
    return this.userService.find(userId)
  }
}
