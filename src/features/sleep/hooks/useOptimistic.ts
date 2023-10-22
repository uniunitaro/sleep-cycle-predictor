import { useEffect, useReducer, useRef } from 'react'

export const useOptimistic = <T>(src: T) => {
  // HACK 再レンダリング抑制のためにrefを使っている

  const optimisticState = useRef(src)
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const previousSrc = useRef(src)
  const previousOptimisticState = useRef(src)

  const latestChange = useRef<'src' | 'optimistic'>('src')

  const setOptimisticState = (value: T) => {
    if (JSON.stringify(optimisticState.current) !== JSON.stringify(value)) {
      previousOptimisticState.current = optimisticState.current
    }
    optimisticState.current = value
    latestChange.current = 'optimistic'

    forceUpdate()
  }

  // HACK JSON.stringifyでは正確性が保証されないので変える
  useEffect(() => {
    if (JSON.stringify(previousSrc.current) !== JSON.stringify(src)) {
      previousSrc.current = src

      latestChange.current = 'src'

      optimisticState.current = src
      previousOptimisticState.current = src
    }
  }, [src])

  const latestValue =
    latestChange.current === 'src' ? src : optimisticState.current

  return [latestValue, setOptimisticState] as const
}
