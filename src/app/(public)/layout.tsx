import { Box, Flex } from '@/components/chakra'
import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'

export default function PublicLayout({
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
      <SignedOutHeader />
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}
