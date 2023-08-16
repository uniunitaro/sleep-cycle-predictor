import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const redirectBasedOnAuthState = async (
  condition: 'authed' | 'unauthed',
  redirectUrl: string
) => {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (
    (condition === 'authed' && session) ||
    (condition === 'unauthed' && !session)
  ) {
    redirect(redirectUrl)
  }
}
