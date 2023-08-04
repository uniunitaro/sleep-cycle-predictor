import { ReactElement } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import SignedInHeader from '../SignedInHeader/SignedInHeader'

const SignedInLayout = ({ children }: { children: ReactElement }) => {
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
      {/* <SignedInHeader /> */}
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}

export default SignedInLayout
