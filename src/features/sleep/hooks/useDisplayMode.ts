import { useRouter } from 'next/navigation'
import { addMonths } from 'date-fns'
import { useState, useEffect, useTransition } from 'react'
import { DisplayMode } from '../types/chart'
import { setCookie } from '../server/setCookie'
import { useHandleSearchParams } from '@/hooks/useHandleSearchParams'

export const useDisplayMode = (displayMode: DisplayMode) => {
  const router = useRouter()
  const [currentDisplayMode, setCurrentDisplayMode] = useState(displayMode)
  useEffect(() => {
    setCurrentDisplayMode(displayMode)
  }, [displayMode])

  const [, startTransition] = useTransition()
  const { addSearchParamsWithCurrentPathname } = useHandleSearchParams()
  const handleChange = (displayMode: DisplayMode) => {
    setCurrentDisplayMode(displayMode)
    startTransition(() => {
      setCookie('displayMode', displayMode, addMonths(new Date(), 1))
    })
    router.push(addSearchParamsWithCurrentPathname('view', displayMode))
  }

  return { currentDisplayMode, handleChange }
}
