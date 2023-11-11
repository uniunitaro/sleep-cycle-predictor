import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code).catch(() => {
      // 違うブラウザでメールアドレスの確認をするとエラーになる
      // 確認自体は正常に完了しているのでそのままリダイレクトする
    })
  }

  const next = requestUrl.searchParams.get('next')
  return next
    ? NextResponse.redirect(requestUrl.origin + next)
    : NextResponse.redirect(requestUrl.origin)
}
