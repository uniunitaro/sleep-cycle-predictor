'use server'

import { cookies, headers } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { addUser } from '@/features/user/repositories/users'
import { logger } from '@/libs/axiomLogger'

export const signUp = async ({
  nickname,
  email,
  password,
}: {
  nickname: string
  email: string
  password: string
}): Promise<{ error?: boolean }> => {
  try {
    const supabase = createServerActionClient({ cookies })

    const headersList = headers()
    const origin = headersList.get('origin')
    if (!origin) throw new Error('origin not found')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback?next=/home`,
      },
    })
    if (error || !data.user) {
      throw error
    }

    const { error: dbError } = await addUser({
      id: data.user.id,
      nickname,
      email,
    })
    if (dbError) throw dbError

    return {}
  } catch (e) {
    logger.error(e)
    return { error: true }
  }
}
