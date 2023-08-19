import { useEffect, useRef } from 'react'

export const useNextTick = () => {
  const isCallbackPending = useRef(false)
  const callback = useRef<() => void>()
  useEffect(() => {
    if (isCallbackPending.current) {
      callback.current?.()
      isCallbackPending.current = false
    }
  })

  return (cb: () => void) => {
    isCallbackPending.current = true
    callback.current = cb
  }
}
