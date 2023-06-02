import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsDate } from 'class-validator'
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
  @IsArray()
  @ArrayNotEmpty()
  sleeps: Sleep[]
}
class Sleep {
  @IsDate()
  @Type(() => Date)
  start: Date

  @IsAfter('start')
  @IsDate()
  @Type(() => Date)
  end: Date
}

export class UpdateSleepRequest extends CreateSleepRequest {}
