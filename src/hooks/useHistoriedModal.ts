import { useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useHistoriedModal = (): ReturnType<typeof useDisclosure> => {
  const { onOpen: _onOpen, onClose: _onClose, ...rest } = useDisclosure()

  const router = useRouter()
  const onOpen = () => {
    _onOpen()
    router.push({ query: { ...router.query, modal: true } })
  }

  const onClose = () => {
    _onClose()
    const newQuery = router.query
    delete newQuery.modal

    router.replace({ query: newQuery })
  }

  useEffect(() => {
    router.beforePopState(({ url }) => {
      console.log(url)

      if (!url.includes('modal=true')) {
        _onClose()
        return true
      }
      return true
    })

    return () => router.beforePopState(() => true)
  }, [_onClose, router])

  return { onOpen, onClose, ...rest }
}
