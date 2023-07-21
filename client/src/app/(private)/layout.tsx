import { Box, Flex } from '@/components/chakra'
import SignedInHeader from '@/components/SignedInHeader/SignedInHeader'

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
      <SignedInHeader />
      <Box flex="1" minH="0">
        {children}
      </Box>
    </Flex>
  )
}
