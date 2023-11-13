'use server'

import { addCalendar } from '../repositories/users'
import { parseICals } from '@/features/sleep/server/parseICal'

export const validateAndAddCalendar = async (
  newUrl: string
): Promise<{ error?: true }> => {
  const { data, error } = await parseICals([newUrl])
  if (error) return { error: true }

  const { error: addError } = await addCalendar({
    name: data[0].calendarName ?? newUrl,
    url: newUrl,
  })
  if (addError) return { error: true }

  return {}
}
