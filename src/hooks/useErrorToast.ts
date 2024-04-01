import { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'

export const useErrorToast = () => {
  const toast = useToast()
  return useCallback(() => {
    toast({
      title: 'エラーが発生しました。',
      status: 'error',
      isClosable: true,
    })
  }, [toast])
}
