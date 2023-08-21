import { useEffect, useRef, useState } from 'react'

export const useOptimistic = <T>(src: T) => {
  const [optimisticState, setOptimisticState] = useState(src)

  const previousSrc = useRef(src)
  const previousOptimisticState = useRef(optimisticState)

  // HACK JSON.stringifyでは正確性が保証されないので変える
  useEffect(() => {
    if (JSON.stringify(previousSrc.current) !== JSON.stringify(src)) {
      previousSrc.current = src
    } else if (
      JSON.stringify(previousOptimisticState.current) !==
      JSON.stringify(optimisticState)
    ) {
      previousOptimisticState.current = optimisticState
    }
  })

  const latestValue = (() => {
    if (
      JSON.stringify(previousOptimisticState.current) !==
      JSON.stringify(optimisticState)
    ) {
      return optimisticState
    } else {
      return src
    }
  })()

  return [latestValue, setOptimisticState] as const
}
