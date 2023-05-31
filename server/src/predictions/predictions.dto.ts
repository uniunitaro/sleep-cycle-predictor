import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { IsAfter } from 'src/libs/customValidation'

export class GetMyPredictionsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}

export class GetPredictionsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}
