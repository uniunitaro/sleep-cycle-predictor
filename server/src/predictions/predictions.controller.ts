import { Controller, Get, Param, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from './predictions.dto'
import { PredictionsService } from './predictions.service'

@Controller('users/me/predictions')
export class MyPredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get()
  async getPredictions(
    @Req() req: Request,
    @Query() getMyPredictionsRequest: GetMyPredictionsRequest,
  ) {
    return this.predictionsService.getMyPredictions(
      req,
      getMyPredictionsRequest,
    )
  }
}

@Controller('users/:userId/predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get()
  async getPredictions(
    @Param('userId') userId: string,
    @Query() getPredictionsRequest: GetPredictionsRequest,
  ) {
    return this.predictionsService.getPredictions(userId, getPredictionsRequest)
  }
}
