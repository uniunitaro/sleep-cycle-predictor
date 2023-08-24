import Link from 'next/link'
import { FC, Suspense } from 'react'
import ColorModeToggle from '../ColorModeToggle'
import Logo from '@/components/Logo/Logo'
import { Container, Flex, HStack, Spacer } from '@/components/chakra'
import UserMenuContainer from '@/features/user/components/UserMenu/UserMenuContainer'

const SignedInHeader: FC = () => {
  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="full">
          <Link href="/home">
            <Logo />
          </Link>
          <Spacer />
          <HStack spacing="4">
            <ColorModeToggle />
            <Suspense>
              <UserMenuContainer />
            </Suspense>
          </HStack>
        </Flex>
      </Container>
    </header>
  )
}

export default SignedInHeader
