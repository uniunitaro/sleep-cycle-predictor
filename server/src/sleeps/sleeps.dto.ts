import { Type } from 'class-transformer'
import { IsArray, IsDate } from 'class-validator'
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

  @IsArray()
  segmentedSleeps: SegmentedSleep[]
}
class SegmentedSleep {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}
