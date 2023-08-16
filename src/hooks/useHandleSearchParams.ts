import { usePathname, useSearchParams } from 'next/navigation'

export const useHandleSearchParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const addSearchParams = (key: string, value: string) => {
    return new URLSearchParams([
      ...Array.from(searchParams.entries()).filter(([_key]) => _key !== key),
      [key, value],
    ])
  }

  const addSearchParamsWithCurrentPathname = (key: string, value: string) => {
    const newSearchParams = addSearchParams(key, value)
    return `${pathname}?${newSearchParams.toString()}`
  }

  const removeSearchParams = (key: string) => {
    return new URLSearchParams(
      Array.from(searchParams.entries()).filter(([_key]) => _key !== key)
    )
  }

  const removeSearchParamsWithCurrentPathname = (key: string) => {
    const newSearchParams = removeSearchParams(key)
    const hasSearchParam = Array.from(newSearchParams.keys()).length > 0
    return hasSearchParam
      ? `${pathname}?${newSearchParams.toString()}`
      : pathname
  }

  return {
    addSearchParams,
    removeSearchParams,
    addSearchParamsWithCurrentPathname,
    removeSearchParamsWithCurrentPathname,
  }
}
