'use client'

import { FC } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { BsCalendar3, BsCalendar3Week, BsListUl } from 'react-icons/bs'
import { MdInstallMobile } from 'react-icons/md'
import {
  Box,
  Button,
  ButtonProps,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  useColorModeValue,
  useDisclosure,
} from './chakra'
import Logo from './Logo/Logo'
import { Drawer, DrawerBody, DrawerHeader } from './Drawer/Drawer'
import { DisplayMode } from '@/features/sleep/types/chart'
import { useDisplayMode } from '@/features/sleep/hooks/useDisplayMode'
import { usePWAInstall } from '@/features/sleep/hooks/usePWAInstall'

const DrawerMenu: FC<{ displayMode: DisplayMode }> = ({ displayMode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { currentDisplayMode, handleChange } = useDisplayMode(displayMode)

  const { canInstallPWA, handleInstall } = usePWAInstall()

  return (
    <>
      {currentDisplayMode !== 'list' && (
        <Box srOnly>
          スクリーンリーダーをご利用の方は、メニューの表示形式からリストを選択してください
        </Box>
      )}
      <IconButton
        icon={<HamburgerIcon boxSize="5" />}
        aria-label="メニューを開く"
        variant="ghost"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerHeader bgColor="globalBg">
          <HStack justifyContent="space-between">
            <Box aria-hidden>
              <Logo />
            </Box>
            <CloseButton onClick={onClose}></CloseButton>
          </HStack>
        </DrawerHeader>
        <DrawerBody px="0" bgColor="globalBg">
          <Stack h="full" pr="3">
            <Box>
              <Box as="h2" srOnly>
                表示形式
              </Box>
              <DrawerItem
                leftIcon={<Icon as={BsCalendar3Week} />}
                isSelected={currentDisplayMode === 'week'}
                onClick={() => {
                  handleChange('week')
                  onClose()
                }}
              >
                週
              </DrawerItem>
              <DrawerItem
                leftIcon={<Icon as={BsCalendar3} />}
                isSelected={currentDisplayMode === 'month'}
                onClick={() => {
                  handleChange('month')
                  onClose()
                }}
              >
                月
              </DrawerItem>
              <DrawerItem
                leftIcon={<Icon as={BsListUl} />}
                isSelected={currentDisplayMode === 'list'}
                onClick={() => {
                  handleChange('list')
                  onClose()
                }}
              >
                リスト
              </DrawerItem>
            </Box>
            <Spacer />
            {canInstallPWA && (
              <DrawerItem
                leftIcon={<Icon as={MdInstallMobile} />}
                colorScheme="gray"
                onClick={handleInstall}
              >
                ホーム画面に追加
              </DrawerItem>
            )}
          </Stack>
        </DrawerBody>
      </Drawer>
    </>
  )
}

const DrawerItem: FC<ButtonProps & { isSelected?: boolean }> = ({
  isSelected,
  colorScheme,
  ...props
}) => {
  const bgColor = useColorModeValue('brand.100', 'brand.800')
  const bgActiveColorDefault = useColorModeValue('brand.200', 'brand.700')
  const bgActiveColor = bgActiveColorDefault
  return (
    <Button
      w="full"
      h="14"
      px="6"
      display="flex"
      borderLeftRadius="none"
      variant="ghost"
      fontWeight="medium"
      justifyContent="left"
      iconSpacing="6"
      aria-current={isSelected}
      bgColor={!colorScheme && isSelected ? bgColor : undefined}
      _hover={
        !colorScheme ? { bgColor: isSelected ? bgColor : undefined } : undefined
      }
      _active={
        !colorScheme
          ? { bgColor: !colorScheme ? bgActiveColor : undefined }
          : undefined
      }
      {...props}
    />
  )
}

export default DrawerMenu
