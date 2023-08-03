'use server'

import {
  createServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const getAuthUserIdWithServerAction = async (): Promise<
  { userId: string; error?: undefined } | { userId?: undefined; error: true }
> => {
  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return { error: true }

  const userId = data.session.user.id
  return { userId }
}

export const getAuthUserIdWithServerComponent = async (): Promise<
  { userId: string; error?: undefined } | { userId?: undefined; error: true }
> => {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return { error: true }

  const userId = data.session.user.id
  return { userId }
}
