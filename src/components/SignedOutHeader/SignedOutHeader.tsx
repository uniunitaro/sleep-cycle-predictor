import Link from 'next/link'
import { FC, ReactNode } from 'react'
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Show,
  Spacer,
} from '@/components/chakra'
import Logo from '@/components/Logo/Logo'

const SignedOutHeader: FC<{ drawer?: ReactNode }> = ({ drawer }) => {
  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="100%">
          <HStack spacing="4">
            {drawer}
            <Link href="/">
              <Logo />
            </Link>
          </HStack>
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
