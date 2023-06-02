import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { UsersService } from './users.service'
import { CreateUserRequest, UpdateUserRequest } from './users.dto'

@UseGuards(AuthGuard)
@Controller('users/me')
export class MeController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findMe(@Req() req: Request) {
    return this.userService.findMe(req)
  }

  @Put()
  async update(@Req() req: Request, @Query() payload: UpdateUserRequest) {
    return this.userService.update(req, payload)
  }

  @Delete()
  @HttpCode(204)
  async remove(@Req() req: Request) {
    return this.userService.remove(req)
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Req() req: Request, @Query() payload: CreateUserRequest) {
    return this.userService.create(req, payload)
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.userService.find(id)
  }
}
