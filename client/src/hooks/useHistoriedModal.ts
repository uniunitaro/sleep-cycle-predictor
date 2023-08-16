import { useDisclosure } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useHandleSearchParams } from './useHandleSearchParams'

export const useHistoriedModal = (): ReturnType<typeof useDisclosure> => {
  const { onOpen: _onOpen, onClose: _onClose, ...rest } = useDisclosure()

  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    addSearchParamsWithCurrentPathname,
    removeSearchParamsWithCurrentPathname,
  } = useHandleSearchParams()

  const onOpen = () => {
    _onOpen()

    router.push(addSearchParamsWithCurrentPathname('modal', 'true'))
  }

  const onClose = () => {
    _onClose()

    router.replace(removeSearchParamsWithCurrentPathname('modal'))
  }

  useEffect(() => {
    if (!Array.from(searchParams.keys()).includes('modal')) {
      _onClose()
    }
  }, [_onClose, searchParams])

  return { onOpen, onClose, ...rest }
}
