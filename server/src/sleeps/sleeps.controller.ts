import {
  Body,
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
import { FindOneParams } from 'src/global.dto'
import { SleepsService } from './sleeps.service'
import {
  CreateSleepRequest,
  GetSleepsRequest,
  UpdateSleepRequest,
} from './sleeps.dto'

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

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Req() req: Request,
    @Body() payload: UpdateSleepRequest,
  ) {
    return this.sleepsService.update(params.id, req, payload)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() params: FindOneParams, @Req() req: Request) {
    return this.sleepsService.remove(params.id, req)
  }
}
