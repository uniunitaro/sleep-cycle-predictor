'use server'

import { cookies } from 'next/headers'
import { RequestCookies } from '@edge-runtime/cookies'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

export const signUp = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ error?: boolean }> => {
  // const cookies = new RequestCookies() as any
  try {
    const supabase = createServerActionClient({ cookies })

    const { error } = await supabase.auth.signUp({
      email,
      password,
      // TODO ジャンプ先URLを指定
    })
    if (error) {
      throw error
    }
    return {}
  } catch (e) {
    console.log(e)
    return { error: true }
  }
}
