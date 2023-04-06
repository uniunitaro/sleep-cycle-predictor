import { Container, Heading, HStack } from '@chakra-ui/react'
import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <Container maxW="container.xl" height="16">
        <HStack align="center" h="100%">
          <Link href="/">
            <Heading size="lg">Sleep Cycle Predictor</Heading>
          </Link>
        </HStack>
      </Container>
    </header>
  )
}

export default Header
