import { Module } from '@nestjs/common'
import { SleepsService } from './sleeps.service'
import { MySleepsController } from './sleeps.controller'

@Module({
  providers: [SleepsService],
  controllers: [MySleepsController],
})
export class SleepsModule {}
