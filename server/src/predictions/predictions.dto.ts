import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class GetMyPredictionsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsDate()
  @Type(() => Date)
  end: Date

  @IsDate()
  @Type(() => Date)
  srcStart: Date
}

export class GetPredictionsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsDate()
  @Type(() => Date)
  end: Date
}
