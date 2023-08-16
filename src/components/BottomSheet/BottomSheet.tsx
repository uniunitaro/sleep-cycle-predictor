'use client'

import { FC, useEffect } from 'react'
import {
  PanInfo,
  isValidMotionProp,
  motion,
  useAnimationControls,
} from 'framer-motion'
import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalProps,
  chakra,
  shouldForwardProp,
  useColorModeValue,
} from '../chakra'

export {
  ModalBody as BottomSheetBody,
  ModalFooter as BottomSheetFooter,
  ModalHeader as BottomSheetHeader,
} from '../chakra'

const MotionSection = chakra(motion.section, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})

export type BottomSheetProps = Omit<
  ModalProps,
  'motionPreset' | 'scrollBehavior'
>
export const BottomSheet: FC<BottomSheetProps> = (modalProps) => {
  const overlayControls = useAnimationControls()
  const contentControls = useAnimationControls()

  useEffect(() => {
    if (modalProps.isOpen) {
      const startOpenAnimation = () => {
        overlayControls.start({ opacity: 1 })
        contentControls.start({
          y: 0,
          transition: { duration: 0.2, ease: 'easeInOut' },
        })
      }

      // HACK setTimeoutを使わないとアニメーションが開始しない
      setTimeout(() => {
        startOpenAnimation()
      }, 0)
    }
  }, [modalProps.isOpen, overlayControls, contentControls])

  const startCloseAnimation = async () => {
    contentControls.start({
      y: '100%',
      transition: { duration: 0.2, ease: 'easeInOut' },
    })
    await overlayControls.start({ opacity: 0 })
  }

  const handleDragEnd = async (info: PanInfo) => {
    const shouldClose =
      (info.velocity.y >= 0 && info.offset.y > 50) || info.velocity.y > 20
    if (shouldClose) {
      await startCloseAnimation()
      modalProps.onClose()
    } else {
      contentControls.start({
        y: 0,
        transition: { duration: 0.2, ease: 'easeInOut' },
      })
    }
  }

  const handleClose = async () => {
    await startCloseAnimation()
    modalProps.onClose()
  }

  const topBarColor = useColorModeValue('gray.300', 'gray.500')

  return (
    <Modal
      isOpen={modalProps.isOpen}
      onClose={modalProps.onClose}
      motionPreset="none"
      scrollBehavior="inside"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      // trueもしくはundefined(デフォルト)のときは閉じる
      onEsc={modalProps.closeOnEsc === false ? undefined : handleClose}
      onOverlayClick={
        modalProps.closeOnOverlayClick === false ? undefined : handleClose
      }
    >
      <ModalOverlay
        as={motion.div}
        animate={overlayControls}
        initial={{ opacity: 0 }}
      />
      <MotionSection
        as={ModalContent}
        pos="absolute"
        bottom="0px"
        my="0"
        borderRadius="none"
        borderTopRadius="2xl"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={false}
        onDragEnd={(_, info) => handleDragEnd(info)}
        animate={contentControls}
        initial={{ y: '100%' }}
      >
        <Box display="grid" placeItems="center" pt="2" pb="4">
          <Box w="16" h="1" rounded="full" bgColor={topBarColor}></Box>
        </Box>
        {modalProps.children}
      </MotionSection>
    </Modal>
  )
}
