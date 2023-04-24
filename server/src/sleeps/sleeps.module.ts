import { Module } from '@nestjs/common'
import { SleepsService } from './sleeps.service'
import { SleepsController } from './sleeps.controller'

@Module({
  providers: [SleepsService],
  controllers: [SleepsController],
})
export class SleepsModule {}
