'use server'

import { cookies } from 'next/headers'

export const setCookie = async (
  key: string,
  value: string,
  expires?: number | Date
) => {
  cookies().set(key, value, { expires })
}
