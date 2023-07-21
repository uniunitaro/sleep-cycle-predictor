import { useDisclosure } from '@chakra-ui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const useHistoriedModal = (): ReturnType<typeof useDisclosure> => {
  const { onOpen: _onOpen, onClose: _onClose, ...rest } = useDisclosure()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onOpen = () => {
    _onOpen()

    if (!pathname || !searchParams) return
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.append('modal', 'true')
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  const onClose = () => {
    _onClose()

    if (!pathname || !searchParams) return
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('modal')
    const hasSearchParam = Array.from(newSearchParams.keys()).length > 0
    router.replace(
      hasSearchParam ? `${pathname}?${searchParams.toString()}` : pathname
    )
  }

  useEffect(() => {
    if (!searchParams) return

    if (!Array.from(searchParams.keys()).includes('modal')) {
      _onClose()
    }
  }, [_onClose, searchParams])

  return { onOpen, onClose, ...rest }
}
