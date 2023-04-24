import {
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  async signin(@Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.setAuthCookies(req, res)
      res.send({ success: true })
    } catch {
      throw new InternalServerErrorException()
    }
  }

  @Post('signout')
  @HttpCode(200)
  async signout(@Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.unsetAuthCookies(req, res)
      res.send({ success: true })
    } catch {
      throw new InternalServerErrorException()
    }
  }
}
