'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { getAuthUserIdWithServerAction } from '@/utils/getAuthUserId'
import { config, sleep, user } from '@/db/schema'
import { uuidToBin } from '@/utils/uuid'
import { log } from '@/libs/axiomLogger'

export const deleteAccount = async (): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const cookieStore = cookies()
    const supabase = createServerActionClient(
      { cookies: () => cookieStore },
      { supabaseKey: process.env.SUPABASE_SERVICE_ROLE }
    )
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
    if (deleteError) throw deleteError

    await db
      .transaction(async (tx) => {
        await tx.delete(user).where(eq(user.id, uuidToBin(userId)))
        await tx.delete(config).where(eq(config.userId, uuidToBin(userId)))
        await tx.delete(sleep).where(eq(sleep.userId, uuidToBin(userId)))
      })
      .catch((e) => {
        log.error(e)
        // DBの削除に失敗してもフロントにエラーは返さない
      })

    revalidatePath('/home')
    revalidatePath('/[userId]')

    await supabase.auth.signOut()

    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}
