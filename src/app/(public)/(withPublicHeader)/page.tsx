import Link from 'next/link'
import Image from 'next/image'
import HeroHeading from '../components/HeroHeading'
import Features from '../components/Features'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@/components/chakra'
import heroDesktop from '@/assets/hero-desktop.png'
import heroMobile from '@/assets/hero-mobile.png'
import { detectMobileByUserAgent } from '@/utils/detectMobileByUserAgent'

const IndexPage = () => {
  const { isMobile } = detectMobileByUserAgent()

  return (
    <Container as="main" maxW="7xl" py="4">
      <VStack py="20" spacing="16">
        <VStack spacing="8">
          <HeroHeading />
          <Text
            color="secondaryGray"
            fontSize={{ base: 'md', md: 'xl' }}
            textAlign="center"
            wordBreak="keep-all"
            overflowWrap="anywhere"
          >
            非24時間睡眠覚醒症候群の人を
            <wbr />
            サポートする、
            <wbr />
            睡眠サイクル予測
            <wbr />
            アプリケーション。
            <br />
            あなたの体内時計に合わせて、
            <wbr />
            日々のスケジュールを
            <wbr />
            調整しましょう。
            <br />
          </Text>
          <Button
            as={Link}
            href="/signup"
            colorScheme="green"
            size="lg"
            px="16"
            py="7"
            w={{ base: 'full', md: 'auto' }}
          >
            無料ではじめる
          </Button>
        </VStack>
        <Box rounded="2xl" overflow="hidden" maxW="4xl" boxShadow="2xl">
          {isMobile ? (
            <Image src={heroMobile} alt="アプリケーションのイメージ" />
          ) : (
            <Image src={heroDesktop} alt="アプリケーションのイメージ" />
          )}
        </Box>
        <VStack spacing="8" mt="16">
          <Heading
            as="h2"
            size="lg"
            textAlign="center"
            wordBreak="keep-all"
            overflowWrap="anywhere"
          >
            リズムに合わせて
            <wbr />
            未来をプラン
          </Heading>
          <Features />
        </VStack>
      </VStack>
    </Container>
  )
}

export default IndexPage
