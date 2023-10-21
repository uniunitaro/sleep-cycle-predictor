import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { addUser } from '@/features/user/repositories/users'
import { log } from '@/libs/axiomLogger'

export const runtime = 'edge'

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user || !data.user.email || !data.session) {
      log.error(error)
      return
    }

    // TODO エラー処理 ロールバック
    const { error: dbError } = await addUser({
      id: data.user.id,
      nickname: data.user.user_metadata.name,
      email: data.user.email,
      avatarUrl: data.user.user_metadata.avatar_url,
    })
  }

  const next = requestUrl.searchParams.get('next')
  return next
    ? NextResponse.redirect(requestUrl.origin + next)
    : NextResponse.redirect(requestUrl.origin)
}
