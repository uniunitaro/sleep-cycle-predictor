import { ReactElement } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import SignedOutHeader from './SignedOutHeader'

const SignedOutLayout = ({ children }: { children: ReactElement }) => {
  return (
    <Flex
      w="100%"
      direction="column"
      overflow="hidden"
      height={{ base: undefined, md: '100vh' }}
    >
      <SignedOutHeader />
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}

export default SignedOutLayout
