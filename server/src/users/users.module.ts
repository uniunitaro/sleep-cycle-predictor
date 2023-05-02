import { Module } from '@nestjs/common'
import { MeController, UsersController } from './users.controller'
import { UserService } from './users.service'

@Module({
  controllers: [MeController, UsersController],
  providers: [UserService],
})
export class UsersModule {}
