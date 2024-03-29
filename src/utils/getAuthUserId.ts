'use server'

import {
  createServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { AuthError } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Result } from '@/types/global'

export const getAuthUserIdWithServerAction = async (): Promise<
  Result<{ userId: string }, AuthError | 'no session'>
> => {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })
  const { data, error } = await supabase.auth.getSession()
  if (error) return { error }
  if (!data.session) return { error: 'no session' }

  const userId = data.session.user.id
  return { userId }
}

export const getAuthUserIdWithServerComponent = async (): Promise<
  Result<{ userId: string }, AuthError | 'no session'>
> => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data, error } = await supabase.auth.getSession()
  if (error) return { error }
  if (!data.session) return { error: 'no session' }

  const userId = data.session.user.id
  return { userId }
}
