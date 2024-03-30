import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

const maintenanceExcludePaths = ['/']

const isInMaintenanceMode = process.env.IS_IN_MAINTENANCE_MODE === 'true'

export const middleware = async (req: NextRequest) => {
  if (!isInMaintenanceMode) {
    if (req.nextUrl.pathname === '/maintenance') {
      const url = req.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (
    isInMaintenanceMode &&
    !maintenanceExcludePaths.includes(req.nextUrl.pathname)
  ) {
    if (req.nextUrl.pathname === '/maintenance') return

    const url = req.nextUrl.clone()
    url.pathname = '/maintenance'
    return NextResponse.redirect(url)
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}

export const config = {
  matcher: ['/((?!public|static|api|_next|favicon.ico).*)'],
}
