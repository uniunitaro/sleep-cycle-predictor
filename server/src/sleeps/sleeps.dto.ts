import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class GetSleepsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsDate()
  @Type(() => Date)
  end: Date
}

export class PostSleepRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsDate()
  @Type(() => Date)
  end: Date
}

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
