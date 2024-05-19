'use client'

import { FC, useEffect, useRef, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { updateGoogleConfig } from '../../repositories/users'
import { useErrorToast } from '@/hooks/useErrorToast'
import GoogleCalendarLogo from '@/features/auth/components/GoogleCalendarLogo'
import { redirectToGoogleAuth } from '@/features/googleApi/server/redirectToGoogleAuth'

const GoogleCalendarSetting: FC<{ isConnected: boolean }> = ({
  isConnected,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const [isPending, startTransition] = useTransition()
  const handleConnect = () => {
    startTransition(async () => {
      await redirectToGoogleAuth()
    })
  }

  const errorToast = useErrorToast()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.has('error')) {
      // リダイレクト時にエラーがある場合はトーストを表示
      errorToast()
    }
  }, [errorToast, searchParams])

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await updateGoogleConfig({
        rawGoogleRefreshToken: null,
        googleCalendarId: null,
      })
      if (error) {
        errorToast()
        return
      }
    })
  }

  return !isConnected ? (
    <Stack spacing="4">
      <Text color="secondaryGray" fontSize="sm">
        Google カレンダーと連携すると、睡眠予測をカレンダーに表示できます。
        <br />
        睡眠予測は新しいカレンダーに表示され、 Sleep Predictor
        があなたのカレンダーや予定にアクセスすることはありません。
      </Text>
      <Button
        leftIcon={<GoogleCalendarLogo />}
        colorScheme="brand"
        variant="outline"
        isLoading={isPending}
        onClick={handleConnect}
      >
        Google カレンダーと連携する
      </Button>
    </Stack>
  ) : (
    <>
      <Stack spacing="4">
        <Text color="secondaryGray" fontSize="sm">
          現在 Google カレンダーと連携しています。睡眠予測は自動的に Google
          カレンダーに表示されます。
        </Text>
        <Button colorScheme="gray" variant="outline" onClick={onOpen}>
          連携を解除する
        </Button>
      </Stack>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx="4">
          <AlertDialogHeader>Google カレンダー連携を解除</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>連携を解除しますか？</AlertDialogBody>
          <AlertDialogFooter pt="7">
            <ButtonGroup>
              <Button
                ref={cancelRef}
                color="secondaryGray"
                variant="ghost"
                onClick={onClose}
              >
                キャンセル
              </Button>
              <Button
                colorScheme="gray"
                variant="outline"
                isLoading={isPending}
                onClick={handleDelete}
              >
                解除する
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default GoogleCalendarSetting
