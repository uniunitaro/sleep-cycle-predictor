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
    console.time('getSleeps')
    const sleeps = await this.sleepsService.getSleeps(req, getSleepsRequest)
    console.timeEnd('getSleeps')
    return sleeps
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
    console.time('getPredictions')

    const predictions = await this.sleepsService.getMyPredictions(
      req,
      getMyPredictionsRequest,
    )
    console.timeEnd('getPredictions')
    return predictions
  }
}
