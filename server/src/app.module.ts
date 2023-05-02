import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { SleepsModule } from './sleeps/sleeps.module'
import { LoggerMiddleware } from './logger.middleware'
import { PredictionsModule } from './predictions/predictions.module'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    SleepsModule,
    PredictionsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('')
  }
}
