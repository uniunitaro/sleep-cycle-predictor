import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name)

  use(req: Request, res: Response, next: () => void): void {
    const start = Date.now()
    res.on('finish', () => {
      const end = Date.now()
      const duration = end - start
      this.logger.log(
        `API Response [url=${req.url}, method=${req.method}, duration=${duration}ms]`,
      )
    })

    next()
  }
}
