'use client'

import { FC } from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import {
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
} from '@chakra-ui/react'

const SettingsHeader: FC = () => {
  const router = useRouter()
  const handleClickBack = () => {
    router.push('/home')
  }

  return (
    <header>
      <Container maxW="8xl" height="16">
        <Flex align="center" h="full">
          <HStack spacing="4">
            <IconButton
              icon={<Icon as={ArrowBackIcon} boxSize="6" />}
              aria-label="戻る"
              variant="ghost"
              onClick={handleClickBack}
            />
            <Heading as="h1" size="md">
              設定
            </Heading>
          </HStack>
        </Flex>
      </Container>
    </header>
  )
}

export default SettingsHeader
