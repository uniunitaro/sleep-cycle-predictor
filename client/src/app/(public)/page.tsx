import Link from 'next/link'
import { Button, ButtonGroup, Center, Container } from '@/components/chakra'

const IndexPage = () => {
  return (
    <Container maxW="800px" py="4">
      <Center>
        <ButtonGroup spacing="8" size="lg">
          <Link href="/signin" passHref legacyBehavior>
            <Button as="a" colorScheme="green" variant="outline">
              ログイン
            </Button>
          </Link>
          <Link href="/signup" passHref legacyBehavior>
            <Button as="a" colorScheme="green">
              新規登録
            </Button>
          </Link>
        </ButtonGroup>
      </Center>
    </Container>
  )
}

export default IndexPage
