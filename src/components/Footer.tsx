import { FC } from 'react'
import Link from 'next/link'
import { Button, Container, HStack, Text } from './chakra'

const Footer: FC = () => {
  return (
    <footer>
      <Container maxW="8xl" pt="12" pb="6">
        <HStack
          align="baseline"
          justify="space-between"
          flexDir={{ base: 'column-reverse', md: 'row' }}
        >
          <Text color="secondaryGray" fontSize="sm">
            © 2023-2024 Sleep Predictor
          </Text>
          <HStack spacing="6">
            <Button
              as={Link}
              href="/privacy"
              variant="link"
              fontWeight="normal"
              fontSize="sm"
            >
              プライバシーポリシー
            </Button>
            <Button
              as={Link}
              href="/terms"
              variant="link"
              fontWeight="normal"
              fontSize="sm"
            >
              利用規約
            </Button>
          </HStack>
        </HStack>
      </Container>
    </footer>
  )
}

export default Footer
