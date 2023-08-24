'use server'

import { cookies, headers } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { db } from '@/db'
import { config, user } from '@/db/schema'
import { uuidToBin } from '@/utils/uuidToBin'

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

    await Promise.all([
      db.insert(user).values({
        id: uuidToBin(data.user.id),
        email,
        nickname,
      }),
      db.insert(config).values({
        userId: uuidToBin(data.user.id),
      }),
    ])
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}
