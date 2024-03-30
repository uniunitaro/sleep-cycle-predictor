import { FC, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'
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
} from '@chakra-ui/react'

const PWAInstallModal: FC = () => {
  const { shouldSuggestPWAInstall, handleInstall, handleDismiss } =
    usePWAInstall()

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (shouldSuggestPWAInstall) {
      onOpen()
    }
  }, [shouldSuggestPWAInstall, onOpen])

  const handleClickInstall = () => {
    handleInstall()
    onClose()
  }

  const handleClickDismiss = () => {
    handleDismiss()
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
              onClick={handleClickDismiss}
            >
              あとで
            </Button>
            <Button colorScheme="brand" onClick={handleClickInstall}>
              インストール
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PWAInstallModal
