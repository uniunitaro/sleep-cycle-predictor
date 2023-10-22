import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FC, useEffect, useState, useTransition } from 'react'
import { getAuthUser } from '@/features/user/repositories/users'

const ShareModal: FC<Omit<ModalProps, 'children'>> = (props) => {
  const supabase = createClientComponentClient()
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  const [, startTransition] = useTransition()
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        return
      }

      setUserId(data.session.user.id)
    })()

    startTransition(async () => {
      const { authUser, error } = await getAuthUser()
      if (error || !authUser) {
        return
      }

      setUserName(authUser.nickname)
    })
  }, [supabase.auth])

  const shareData = {
    title: `${userName}さんの睡眠予測`,
    text: `${userName}さんの睡眠予測`,
    url: `${location.origin}/${userId}`,
  } satisfies ShareData

  const canShare = (() => {
    try {
      return navigator.canShare(shareData)
    } catch {
      return false
    }
  })()

  const handleShare = async () => {
    if (!userId) {
      return
    }

    try {
      await navigator.share(shareData)
    } catch {
      return
    }
  }

  const toast = useToast()
  const handleCopy = () => {
    if (!userId) {
      return
    }

    navigator.clipboard.writeText(shareData.url)
    toast({
      title: 'リンクをコピーしました',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Modal isCentered size="sm" {...props}>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>
          睡眠予測を共有
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Text>睡眠予測を他の人と共有するためのリンクを取得できます。</Text>
          <Text fontWeight="bold" mt="4">
            共有されるもの
          </Text>
          <UnorderedList>
            <ListItem>睡眠予測</ListItem>
          </UnorderedList>
          <Text fontWeight="bold" mt="2">
            共有されないもの
          </Text>
          <UnorderedList>
            <ListItem>睡眠記録</ListItem>
          </UnorderedList>
          {(!userId || !userName) && (
            <Alert status="error" mt="4">
              <AlertIcon />
              リンクの生成中にエラーが発生しました。
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              colorScheme="brand"
              variant="outline"
              isDisabled={!userId || !userName}
              onClick={handleCopy}
            >
              リンクをコピー
            </Button>
            {canShare && (
              <Button
                colorScheme="brand"
                isDisabled={!userId || !userName}
                onClick={handleShare}
              >
                共有
              </Button>
            )}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ShareModal
