import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: true,
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(8080)
}
bootstrap()
