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

export class CreateSleepRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsDate()
  @Type(() => Date)
  end: Date
}
