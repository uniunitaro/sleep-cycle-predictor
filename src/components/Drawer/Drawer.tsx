'use client'

import {
  FC,
  useEffect,
  useReducer,
  useRef,
  useState,
  MutableRefObject,
} from 'react'
import {
  PanInfo,
  isValidMotionProp,
  motion,
  useAnimationControls,
  useDragControls,
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
  ModalBody as DrawerBody,
  ModalFooter as DrawerFooter,
  ModalHeader as DrawerHeader,
} from '../chakra'

const MotionSection = chakra(motion.section, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})

export type DrawerProps = Omit<
  ModalProps,
  'motionPreset' | 'scrollBehavior'
> & { placement: 'bottom' | 'left' }
export const Drawer: FC<DrawerProps> = ({
  placement,
  onCloseComplete,
  ...modalProps
}) => {
  const overlayControls = useAnimationControls()
  const contentControls = useAnimationControls()

  const [isOpen, setIsOpen] = useState(modalProps.isOpen)

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    if (modalProps.isOpen) {
      setIsOpen(true)
    } else {
      const startCloseAnimation = async () => {
        if (placement === 'bottom') {
          contentControls.start({
            y: '100%',
            transition: { duration: 0.15, ease: 'easeInOut' },
          })
        } else {
          contentControls.start({
            x: '-100%',
            transition: { duration: 0.15, ease: 'easeInOut' },
          })
        }
        await overlayControls.start({
          opacity: 0,
          transition: { duration: 0.15, ease: 'easeInOut' },
        })
      }

      ;(async () => {
        await startCloseAnimation()
        setIsOpen(false)
        onCloseComplete?.()
      })()
    }
  }, [
    contentControls,
    modalProps.isOpen,
    onCloseComplete,
    overlayControls,
    placement,
  ])

  useEffect(() => {
    if (isOpen) {
      const startOpenAnimation = () => {
        overlayControls.start({ opacity: 1 })
        if (placement === 'bottom') {
          contentControls.start({
            y: 0,
            transition: { duration: 0.2, ease: 'easeInOut' },
          })
        } else {
          contentControls.start({
            x: 0,
            transition: { duration: 0.2, ease: 'easeInOut' },
          })
        }
      }

      // HACK setTimeoutを使わないとアニメーションが開始しない
      setTimeout(() => {
        startOpenAnimation()
        // HACK 再レンダリングさせないとmodalContentRefが取得できない
        forceUpdate()
      }, 0)
    }
  }, [contentControls, isOpen, overlayControls, placement])

  const handleDragEnd = async (info: PanInfo) => {
    const contentHeight = modalContentRef.current?.clientHeight ?? 0
    const contentWidth = modalContentRef.current?.clientWidth ?? 0

    const shouldClose =
      placement === 'bottom'
        ? (info.velocity.y >= 0 && info.offset.y > contentHeight / 3) ||
          info.velocity.y > 20
        : (info.velocity.x <= 0 && info.offset.x < -contentWidth / 3) ||
          info.velocity.x < -20
    if (shouldClose) {
      modalProps.onClose()
    } else {
      if (placement === 'bottom') {
        contentControls.start({
          y: 0,
          transition: { duration: 0.2, ease: 'easeInOut' },
        })
      } else {
        contentControls.start({
          x: 0,
          transition: { duration: 0.2, ease: 'easeInOut' },
        })
      }
    }
  }

  const handleClose = () => {
    modalProps.onClose()
  }

  const topBarColor = useColorModeValue('gray.300', 'gray.500')

  const modalContentRef = useRef<HTMLElement>(null)
  const modalContainerRef = useRef<HTMLElement>(null)
  const [isModalFullHeight, setIsModalFullHeight] = useState(false)
  useEffect(() => {
    const modalContainer = modalContentRef.current?.parentElement
    if (!modalContainer) return
    ;(modalContainerRef as MutableRefObject<HTMLElement>).current =
      modalContainer

    const observer = new ResizeObserver(() => {
      if (
        modalContainer.clientHeight === modalContentRef.current?.clientHeight
      ) {
        setIsModalFullHeight(true)
      } else {
        setIsModalFullHeight(false)
      }
    })
    observer.observe(modalContentRef.current)

    return () => {
      observer.disconnect()
    }
  })

  const canDrag = useRef(false)
  const isDragging = useRef(false)
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    e.stopPropagation()

    if (!modalContentRef.current) return
    const modalContainer = modalContentRef.current.parentElement

    const offsetY =
      e.touches[0].clientY - modalContentRef.current.getBoundingClientRect().top
    const TOP_BAR_HEIGHT = 28

    if (!modalContentRef.current.contains(e.target as Node)) {
      canDrag.current = false
    } else if (placement === 'left') {
      canDrag.current = true
    } else if (offsetY < TOP_BAR_HEIGHT) {
      canDrag.current = true
    } else if (
      modalContainer?.clientHeight === modalContentRef.current.clientHeight ||
      isDragging.current
    ) {
      canDrag.current = false
    } else {
      canDrag.current = true
    }
  }
  const handleTouchEnd = () => {
    isDragging.current = false
  }

  const dragControls = useDragControls()
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (canDrag.current) {
      dragControls.start(e)
      canDrag.current = false
      isDragging.current = true
    }
  }

  const shouldClose = useRef(false)
  const handleContainerTouchStart = (e: TouchEvent) => {
    if (placement === 'bottom') {
      const offsetY =
        e.touches[0].clientY -
        (modalContentRef.current?.getBoundingClientRect().top ?? 0)
      if (offsetY < 0) {
        shouldClose.current = true
      }
    } else {
      const offsetX =
        e.touches[0].clientX -
        (modalContentRef.current?.getBoundingClientRect().right ?? 0)
      if (offsetX > 0) {
        shouldClose.current = true
      }
    }
  }
  const handleContainerTouchEnd = () => {
    if (shouldClose.current) {
      modalProps.onClose()
      shouldClose.current = false
    }
  }

  useEffect(() => {
    if (!modalProps.isOpen) return
    const containerRef = modalContainerRef.current
    containerRef?.addEventListener('touchstart', handleContainerTouchStart)
    containerRef?.addEventListener('touchend', handleContainerTouchEnd)
    return () => {
      containerRef?.removeEventListener('touchstart', handleContainerTouchStart)
      containerRef?.removeEventListener('touchend', handleContainerTouchEnd)
    }
  })

  return (
    <Modal
      {...modalProps}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
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
        onClick={handleClose}
      />
      <MotionSection
        ref={modalContentRef}
        as={ModalContent}
        pos="absolute"
        left={placement === 'left' ? 0 : undefined}
        bottom={placement === 'bottom' ? 0 : undefined}
        h={placement === 'left' ? 'full' : undefined}
        maxH="full"
        w={placement === 'left' ? 'xs' : undefined}
        my="0"
        borderRadius="none"
        borderTopRadius={placement === 'bottom' ? '2xl' : undefined}
        borderRightRadius={placement === 'left' ? '2xl' : undefined}
        overflow="hidden"
        dragControls={dragControls}
        dragListener={false}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerMove={handlePointerMove}
        drag={placement === 'bottom' ? 'y' : 'x'}
        dragConstraints={placement === 'bottom' ? { top: 0 } : { right: 0 }}
        dragElastic={false}
        onDragEnd={(_, info) => handleDragEnd(info)}
        animate={contentControls}
        initial={placement === 'bottom' ? { y: '100%' } : { x: '-100%' }}
        sx={{
          touchAction: 'none',
          '& > *': {
            touchAction: isModalFullHeight ? undefined : 'none',
          },
        }}
      >
        {placement === 'bottom' && (
          <Box display="grid" placeItems="center" pt="2" pb="4">
            <Box
              w="16"
              h="1"
              rounded="full"
              bgColor={topBarColor}
              role="button"
              tabIndex={0}
              cursor="default"
              aria-label="閉じる"
              onKeyDown={(e) => e.key === 'Enter' && handleClose()}
              _focusVisible={{
                _after: {
                  content: '"閉じる"',
                  display: 'block',
                  textAlign: 'center',
                },
              }}
            ></Box>
          </Box>
        )}
        {modalProps.children}
      </MotionSection>
    </Modal>
  )
}
