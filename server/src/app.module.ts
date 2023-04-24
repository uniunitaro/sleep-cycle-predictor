import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { SleepsModule } from './sleeps/sleeps.module'

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, SleepsModule],
})
export class AppModule {}
