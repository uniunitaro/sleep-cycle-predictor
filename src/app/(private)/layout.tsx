import { Box, Flex } from '@chakra-ui/react'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex
      w="full"
      direction="column"
      overflow="hidden"
      sx={{
        height: '100vh',
        '&': {
          height: '100svh',
        },
      }}
    >
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}
