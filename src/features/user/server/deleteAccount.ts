'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAuthUserIdWithServerAction } from '@/utils/getAuthUserId'
import { log } from '@/libs/axiomLogger'
import { createPrisma } from '@/libs/prisma'

export const deleteAccount = async (): Promise<{ error?: true }> => {
  const prisma = createPrisma()

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

    await prisma.user.delete({ where: { id: userId } })

    revalidatePath('/home')
    revalidatePath('/[userId]')

    await supabase.auth.signOut()

    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}
