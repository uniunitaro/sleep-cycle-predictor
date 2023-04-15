import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Show,
  Spacer,
} from '@chakra-ui/react'
import Link from 'next/link'

const SignedOutHeader = () => {
  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="100%">
          <Link href="/">
            <Heading size={{ base: 'md', md: 'lg' }}>
              Sleep Cycle Predictor
            </Heading>
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
                  会員登録
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
