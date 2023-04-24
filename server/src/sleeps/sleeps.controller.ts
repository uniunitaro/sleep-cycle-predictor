import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { SleepsService } from './sleeps.service'
import { GetMyPredictionsRequest, GetSleepsRequest } from './sleeps.dto'

@Controller('users/me/sleeps')
export class SleepsController {
  constructor(private readonly sleepsService: SleepsService) {}

  @Get()
  async getSleeps(
    @Req() req: Request,
    @Query() getSleepsRequest: GetSleepsRequest,
  ) {
    return this.sleepsService.getSleeps(req, getSleepsRequest)
  }

  @Post()
  async postSleep(
    @Req() req: Request,
    @Body() postSleepRequest: GetSleepsRequest,
  ) {
    return this.sleepsService.postSleep(req, postSleepRequest)
  }

  @Get('predictions')
  async getPredictions(
    @Req() req: Request,
    @Query() getMyPredictionsRequest: GetMyPredictionsRequest,
  ) {
    return this.sleepsService.getMyPredictions(req, getMyPredictionsRequest)
  }
}
