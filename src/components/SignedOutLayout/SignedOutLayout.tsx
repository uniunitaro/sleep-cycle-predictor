import { ReactElement } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import SignedOutHeader from '../SignedOutHeader/SignedOutHeader'

const SignedOutLayout = ({ children }: { children: ReactElement }) => {
  return (
    <Flex
      w="100%"
      direction="column"
      overflow="hidden"
      sx={{
        height: '100vh',
        '&': {
          height: '100dvh',
        },
      }}
    >
      <SignedOutHeader />
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}

export default SignedOutLayout
