import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    // 非ログイン時はUnauthorizedExceptionが返るのでスルーして例外レイヤーにキャッチさせる
    const authUser = await this.authService.getAuthUser(request)

    return !!authUser
  }
}
