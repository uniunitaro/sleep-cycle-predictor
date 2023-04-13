import {
  Avatar,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useAuthUserInfo } from '@/features/users/apis/useAuthUserInfo'

const SignedInHeader = () => {
  const { data: authUserInfo } = useAuthUserInfo()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <header>
      <Container maxW="container.xl" height="16">
        <Flex align="center" h="100%">
          <Link href="/">
            <Heading size={{ base: 'md', md: 'lg' }}>
              Sleep Cycle Predictor
            </Heading>
          </Link>
          <Spacer />
          <HStack spacing="4">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              aria-label="ダークモードを切り替え"
              variant="ghost"
              onClick={toggleColorMode}
            />
            {authUserInfo && <Avatar size="sm" name={authUserInfo.nickname} />}
          </HStack>
        </Flex>
      </Container>
    </header>
  )
}

export default SignedInHeader
