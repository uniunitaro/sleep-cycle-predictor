import { useDisclosure } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useHandleSearchParams } from './useHandleSearchParams'

export const useHistoriedModal = (): ReturnType<typeof useDisclosure> => {
  const { onOpen: _onOpen, onClose: _onClose, ...rest } = useDisclosure()

  const { addSearchParamsWithCurrentPathname } = useHandleSearchParams()

  const onOpen = () => {
    _onOpen()

    const currentUrl = document.location.pathname + document.location.search
    const targetUrl = addSearchParamsWithCurrentPathname('modal', 'true')
    if (currentUrl === targetUrl) return

    history.pushState(null, '', targetUrl)
  }

  const onClose = () => {
    _onClose()

    // 本当はバックしたいが、モーダル内でデータを変更した場合にバックしたページに反映されないので諦める
    // 近いうちにNextのアップデートでshallow routingが使えるようになるのでそれを待つ
    // history.back()
  }

  useEffect(() => {
    const listener = () => {
      if (!document.location.search.includes('modal=true')) {
        _onClose()
      }
    }
    window.addEventListener('popstate', listener)

    return () => {
      window.removeEventListener('popstate', listener)
    }
  }, [_onClose])

  return { onOpen, onClose, ...rest }
}
