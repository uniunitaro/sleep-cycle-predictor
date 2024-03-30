import Image from 'next/image'
import Link from 'next/link'
import {
  BasicCard,
  BasicCardBody,
  BasicCardLayout,
} from '@/components/BasicCards'
import Logo from '@/components/Logo/Logo'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import notFoundImage from '@/assets/404.png'

const NotFound = () => {
  return (
    <Box as="main" h="full">
      <BasicCardLayout>
        <BasicCard>
          <BasicCardBody>
            <VStack spacing="12" my="12">
              <Logo />
              <VStack spacing="4">
                <Heading size="lg">ページが見つかりません</Heading>
                <Text>
                  お探しのページは削除されたか、一時的に利用できない可能性があります。
                </Text>
              </VStack>
              <Image src={notFoundImage} height="200" alt="Not Found" />
              <Button as={Link} href="/" colorScheme="brand">
                トップページに戻る
              </Button>
            </VStack>
          </BasicCardBody>
        </BasicCard>
      </BasicCardLayout>
    </Box>
  )
}

export default NotFound
