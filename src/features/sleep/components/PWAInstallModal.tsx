import { FC, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { sleepAddCountAtom } from '../atoms/sleepAddCount'
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@/components/chakra'
import { installPromptAtom } from '@/atoms/installPrompt'

const PWAInstallModal: FC = () => {
  const installPrompt = useAtomValue(installPromptAtom)

  const sleepAddCount = useAtomValue(sleepAddCountAtom)

  const hasDismissedPWAInstall =
    localStorage.getItem('hasDismissedPWAInstall') === 'true'

  const isMobileOrTablet =
    navigator.userAgent.includes('Mobi') ||
    navigator.userAgent.includes('Android')

  const shouldSuggestPWAInstall =
    installPrompt &&
    sleepAddCount >= 2 &&
    !hasDismissedPWAInstall &&
    isMobileOrTablet

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (shouldSuggestPWAInstall) {
      onOpen()
    }
  }, [shouldSuggestPWAInstall, onOpen])

  const handleInstall = () => {
    installPrompt?.prompt()
    onClose()
  }

  const handleDismiss = () => {
    localStorage.setItem('hasDismissedPWAInstall', 'true')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>インストールしてみませんか？</ModalHeader>
        <ModalBody>
          <Text>ホーム画面に追加して、アプリのように使うことができます。</Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              color="secondaryGray"
              variant="ghost"
              onClick={handleDismiss}
            >
              あとで
            </Button>
            <Button colorScheme="brand" onClick={handleInstall}>
              インストール
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PWAInstallModal
