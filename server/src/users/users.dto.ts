import { PartialType } from '@nestjs/mapped-types'

export class CreateUserRequest {
  nickname: string
}

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
