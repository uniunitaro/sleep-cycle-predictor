import axios from 'axios'
import { utcToZonedTime } from 'date-fns-tz'
import { TIMEZONE } from '@/constants/date'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  transformResponse: (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data, dateParseChallenge)
      } catch (e) {
        // Ignore error
      }
    }
    return data
  },
})

const dateParseChallenge = (_key: string, val: any) => {
  if (typeof val === 'string') {
    const date = Date.parse(val)
    if (!Number.isNaN(date)) {
      return utcToZonedTime(date, TIMEZONE)
    }
  }
  return val
}
