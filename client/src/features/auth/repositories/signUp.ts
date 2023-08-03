'use server'

import { cookies } from 'next/headers'
import { RequestCookies } from '@edge-runtime/cookies'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { db } from '@/db'
import { user } from '@/db/schema'

export const signUp = async ({
  nickname,
  email,
  password,
}: {
  nickname: string
  email: string
  password: string
}): Promise<{ error?: boolean }> => {
  // const cookies = new RequestCookies() as any
  try {
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // TODO ジャンプ先URLを指定
    })
    if (error || !data.user) {
      throw error
    }

    await db.insert(user).values({
      id: data.user.id,
      email,
      nickname,
    })
    return {}
  } catch (e) {
    return { error: true }
  }
}
