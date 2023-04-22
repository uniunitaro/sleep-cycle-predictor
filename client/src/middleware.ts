import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const middleware = (request: NextRequest) => {
  // ログイン済のときのリダイレクト処理
  const targetPaths = ['/signin', '/signup']

  if (
    targetPaths.includes(request.nextUrl.pathname) &&
    request.cookies.has('SleepCyclePredictor.AuthUser') &&
    !request.nextUrl.searchParams.has('redirected')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }
}

export default middleware
