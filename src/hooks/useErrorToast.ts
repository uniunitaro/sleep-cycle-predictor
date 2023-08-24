import { useToast } from '@/components/chakra'

export const useErrorToast = () => {
  const toast = useToast()
  return () => {
    toast({
      title: 'エラーが発生しました。',
      status: 'error',
      isClosable: true,
    })
  }
}
