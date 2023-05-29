import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { SleepsService } from './sleeps.service'
import { CreateSleepRequest, GetSleepsRequest } from './sleeps.dto'

@UseGuards(AuthGuard)
@Controller('users/me/sleeps')
export class MySleepsController {
  constructor(private readonly sleepsService: SleepsService) {}

  @Get()
  async findByPeriod(@Req() req: Request, @Query() payload: GetSleepsRequest) {
    return this.sleepsService.findByPeriod(req, payload)
  }

  @Post()
  async create(@Req() req: Request, @Body() payload: CreateSleepRequest) {
    return this.sleepsService.create(req, payload)
  }
}
