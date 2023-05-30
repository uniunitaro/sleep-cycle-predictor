import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { IsAfter } from 'src/libs/customValidation'

export class GetSleepsRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}

export class CreateSleepRequest {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}
