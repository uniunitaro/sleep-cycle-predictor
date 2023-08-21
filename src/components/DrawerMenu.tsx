'use client'

import { FC } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { BsCalendar3, BsCalendar3Week } from 'react-icons/bs'
import {
  Box,
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
  useDisclosure,
} from './chakra'
import Logo from './Logo/Logo'
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
        <DrawerOverlay />
        <DrawerContent borderRightRadius="2xl">
          <DrawerHeader>
            <Logo />
          </DrawerHeader>
          <DrawerBody px="0">
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
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const DrawerItem: FC<ButtonProps & { isSelected?: boolean }> = ({
  isSelected,
  ...props
}) => {
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
      bgColor={isSelected ? 'brand.100' : undefined}
      _hover={{ bgColor: 'brand.100' }}
      _active={{ bgColor: 'brand.200' }}
      {...props}
    />
  )
}

export default DrawerMenu
