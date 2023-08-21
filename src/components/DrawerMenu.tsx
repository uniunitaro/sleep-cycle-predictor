'use client'

import { FC } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { BsCalendar3, BsCalendar3Week, BsListUl } from 'react-icons/bs'
import {
  Box,
  Button,
  ButtonProps,
  Icon,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from './chakra'
import Logo from './Logo/Logo'
import { Drawer, DrawerBody, DrawerHeader } from './Drawer/Drawer'
import { DisplayMode } from '@/features/sleep/types/chart'
import { useDisplayMode } from '@/features/sleep/hooks/useDisplayMode'

const DrawerMenu: FC<{ displayMode: DisplayMode }> = ({ displayMode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { currentDisplayMode, handleChange } = useDisplayMode(displayMode)

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="メニューを開く"
        variant="ghost"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerHeader bgColor="globalBg">
          <Logo />
        </DrawerHeader>
        <DrawerBody px="0" bgColor="globalBg">
          <Box pr="3">
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
        </DrawerBody>
      </Drawer>
    </>
  )
}

const DrawerItem: FC<ButtonProps & { isSelected?: boolean }> = ({
  isSelected,
  ...props
}) => {
  const bgColor = useColorModeValue('brand.100', 'brand.800')
  const bgActiveColor = useColorModeValue('brand.200', 'brand.700')
  return (
    <Button
      w="full"
      h="14"
      px="6"
      borderLeftRadius="none"
      variant="ghost"
      fontWeight="medium"
      justifyContent="left"
      iconSpacing="6"
      bgColor={isSelected ? bgColor : undefined}
      _hover={{ bgColor: bgColor }}
      _active={{ bgColor: bgActiveColor }}
      {...props}
    />
  )
}

export default DrawerMenu
