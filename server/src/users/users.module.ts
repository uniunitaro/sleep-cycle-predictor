import { Module } from '@nestjs/common'
import { MeController, UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [MeController, UsersController],
  providers: [UsersService],
})
export class UsersModule {}
