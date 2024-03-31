'use client'

import { FC, useRef, useState, useTransition } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { BsZoomIn, BsZoomOut } from 'react-icons/bs'
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { updateAvatar } from '../../server/updateAvatar'
import 'cropperjs/dist/cropper.css'
import { useErrorToast } from '@/hooks/useErrorToast'

const AvatarSetting: FC<{ nickname: string; srcUrl?: string }> = ({
  nickname,
  srcUrl,
}) => {
  const badgeColor = useColorModeValue('gray.200', 'gray.600')

  const inputRef = useRef<HTMLInputElement>(null)
  const handleClickAvatar = () => {
    inputRef.current?.click()
  }

  const [inputImage, setInputImage] = useState<string>()

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setInputImage(reader.result as string)
      onOpen()
    }
    reader.readAsDataURL(file)
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const cropperRef = useRef<ReactCropperElement>(null)
  const minZoomRatio = useRef<number>(0)

  const handleReady = () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    const canvas = cropper.getCanvasData()
    const srcWidth = canvas.naturalWidth
    const srcHeight = canvas.naturalHeight

    const container = cropper.getContainerData()
    const containerWidth = container.width
    const containerHeight = container.height
    const containerShortSide = Math.min(containerWidth, containerHeight)

    const zoomRatio =
      srcWidth < srcHeight
        ? containerShortSide / srcWidth
        : containerShortSide / srcHeight

    minZoomRatio.current = zoomRatio

    cropper.zoomTo(zoomRatio)
    cropper.setCropBoxData({
      left: (containerWidth - containerShortSide) / 2,
      top: (containerHeight - containerShortSide) / 2,
      width: containerShortSide,
      height: containerShortSide,
    })
  }

  const [sliderValue, setSliderValue] = useState(0)
  const maxZoomRatioMultiplier = 5
  const exp = 1.5

  const handleSliderChange = (value: number) => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    // valueがmax100のとき、zoomRatioはminZoomRatioの5倍になる 対数カーブになるようにしている
    const zoomRatio =
      minZoomRatio.current *
      (1 + Math.pow(value / 100, exp) * (maxZoomRatioMultiplier - 1))
    cropper.zoomTo(zoomRatio)
  }

  const handleZoom = (e: Cropper.ZoomEvent) => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    if (e.detail.ratio < minZoomRatio.current) {
      e.preventDefault()
      cropper.zoomTo(minZoomRatio.current)
      return
    } else if (e.detail.ratio > minZoomRatio.current * maxZoomRatioMultiplier) {
      e.preventDefault()
      cropper.zoomTo(minZoomRatio.current * maxZoomRatioMultiplier)
      return
    }

    const newSliderValue =
      Math.pow(
        (e.detail.ratio - minZoomRatio.current) /
          ((maxZoomRatioMultiplier - 1) * minZoomRatio.current),
        1 / exp
      ) * 100
    setSliderValue(newSliderValue)
  }

  const errorToast = useErrorToast()
  const [isPending, startTransition] = useTransition()
  const handleSubmit = () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    cropper
      .getCroppedCanvas({
        width: 240,
        height: 240,
      })
      .toBlob(
        (blob) => {
          if (!blob) return
          const formData = new FormData()
          formData.append('file', blob)

          startTransition(async () => {
            const { error } = await updateAvatar(formData, srcUrl)
            if (error) {
              errorToast()
              return
            } else {
              onClose()
            }
          })
        },
        'image/jpeg',
        0.85
      )
  }

  return (
    <Box>
      <Avatar
        as="button"
        name={nickname}
        src={srcUrl}
        // 一瞬だけfallbackが表示されるのを防ぐ
        background={srcUrl ? 'unset' : undefined}
        ignoreFallback
        size="xl"
        onClick={handleClickAvatar}
        mb="3"
        aria-label="プロフィール画像を変更"
      >
        <AvatarBadge bg={badgeColor} border="none" boxSize="1em">
          <EditIcon boxSize="5" color="chakra-body-text"></EditIcon>
        </AvatarBadge>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          onClick={(e) => {
            e.currentTarget.value = ''
          }}
          onChange={handleChangeInput}
          display="none"
        />
      </Avatar>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx="4" h="calc(100% - 128px)" maxH="4xl">
          <ModalHeader>画像を設定</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            sx={{
              '.cropper-view-box, .cropper-center': {
                borderRadius: '50%',
              },
            }}
            minH="0"
            display="flex"
            flexDirection="column"
          >
            <Cropper
              ref={cropperRef}
              src={inputImage}
              style={{ minHeight: 0, flex: '1', width: '100%' }}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              responsive={true}
              autoCropArea={1}
              background={false}
              guides={false}
              dragMode="move"
              aspectRatio={1}
              ready={handleReady}
              cropBoxResizable={false}
              cropBoxMovable={false}
              zoom={handleZoom}
            />
            <HStack mt="4" gap="6">
              <Icon as={BsZoomOut} color="secondaryGray" />
              <Slider
                value={sliderValue}
                colorScheme="green"
                aria-label="画像の拡大率を調整"
                onChange={handleSliderChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize="5" bgColor="buttonBrand" />
              </Slider>
              <Icon as={BsZoomIn} color="secondaryGray" />
            </HStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" color="secondaryGray" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                colorScheme="green"
                isLoading={isPending}
                onClick={handleSubmit}
              >
                保存する
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AvatarSetting
