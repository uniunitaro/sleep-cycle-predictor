import Link from 'next/link'
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Show,
  Spacer,
} from '@/app/_components/chakra'
import Logo from '@/app/_components/Logo/Logo'

const SignedOutHeader = () => {
  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="100%">
          <Link href="/">
            <Logo />
          </Link>
          <Spacer />
          <ButtonGroup spacing="4">
            <Link href="/signin" passHref legacyBehavior>
              <Button
                as="a"
                colorScheme="green"
                variant={{ base: 'solid', md: 'outline' }}
                size={{ base: 'sm', md: 'md' }}
              >
                ログイン
              </Button>
            </Link>
            <Show above="md">
              <Link href="/signup" passHref legacyBehavior>
                <Button as="a" colorScheme="green">
                  新規登録
                </Button>
              </Link>
            </Show>
          </ButtonGroup>
        </Flex>
      </Container>
    </header>
  )
}

export default SignedOutHeader
