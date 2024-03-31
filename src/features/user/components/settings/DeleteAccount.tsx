'use client'

import { FC, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
  useDisclosure,
} from '@chakra-ui/react'
import { deleteAccount } from '../../server/deleteAccount'
import { useErrorToast } from '@/hooks/useErrorToast'

const DeleteAccount: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const [isPending, startTransition] = useTransition()
  const errorToast = useErrorToast()
  const router = useRouter()
  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await deleteAccount()
      if (error) {
        errorToast()
        return
      } else {
        router.replace('/')
      }
    })
  }

  return (
    <>
      <Button colorScheme="red" variant="ghost" onClick={onOpen}>
        アカウントを削除する
      </Button>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx="4">
          <AlertDialogHeader>アカウントを削除</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            本当にアカウントを削除しますか？
            <br />
            この操作は元に戻せません。
          </AlertDialogBody>
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
                colorScheme="red"
                isLoading={isPending}
                onClick={handleDelete}
              >
                削除する
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteAccount
