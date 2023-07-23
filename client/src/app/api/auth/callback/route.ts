import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { RequestCookies } from '@edge-runtime/cookies'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookies = new RequestCookies(request.headers) as any
    const supabase = createRouteHandlerClient({ cookies: () => cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
