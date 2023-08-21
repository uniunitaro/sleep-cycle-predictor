import Link from 'next/link'
import { FC, Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DrawerMenu from './DrawerMenu'
import ColorModeToggle from './ColorModeToggle'
import SignedOutHeader from './SignedOutHeader/SignedOutHeader'
import UserMenuContainer from '@/features/user/components/UserMenu/UserMenuContainer'
import Logo from '@/components/Logo/Logo'
import { Container, Flex, HStack, Hide, Spacer } from '@/components/chakra'
import { DisplayMode } from '@/features/sleep/types/chart'

const ChartPageHeader: FC<{ displayMode: DisplayMode }> = async ({
  displayMode,
}) => {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthed = !!session

  return isAuthed ? (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="full">
          <HStack spacing="4">
            <Hide above="md">
              <DrawerMenu displayMode={displayMode} />
            </Hide>
            <Link href="/home">
              <Logo />
            </Link>
          </HStack>
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
  ) : (
    <SignedOutHeader
      drawer={
        <Hide above="md">
          <DrawerMenu displayMode={displayMode} />
        </Hide>
      }
    />
  )
}

export default ChartPageHeader
