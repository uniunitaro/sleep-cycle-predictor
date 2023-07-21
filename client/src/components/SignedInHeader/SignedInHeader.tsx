'use client'

import Link from 'next/link'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import Logo from '@/components/Logo/Logo'
import {
  Container,
  Flex,
  HStack,
  IconButton,
  Spacer,
  useColorMode,
} from '@/components/chakra'
import UserMenu from '@/features/user/components/UserMenu/UserMenu'

const SignedInHeader = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="100%">
          <Link href="/">
            <Logo />
          </Link>
          <Spacer />
          <HStack spacing="4">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              aria-label="ダークモードを切り替え"
              variant="ghost"
              onClick={toggleColorMode}
            />
            <UserMenu />
          </HStack>
        </Flex>
      </Container>
    </header>
  )
}

export default SignedInHeader
