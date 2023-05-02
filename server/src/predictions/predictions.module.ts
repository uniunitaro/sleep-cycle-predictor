import { Module } from '@nestjs/common'
import { PredictionsService } from './predictions.service'
import {
  MyPredictionsController,
  PredictionsController,
} from './predictions.controller'

@Module({
  providers: [PredictionsService],
  controllers: [MyPredictionsController, PredictionsController],
})
export class PredictionsModule {}
