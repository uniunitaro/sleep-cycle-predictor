import { Grid } from '@chakra-ui/react'
import Footer from '@/components/Footer'
import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Grid
      templateRows="auto 1fr auto"
      templateColumns="100%"
      sx={{
        minHeight: '100vh',
        '&': {
          minHeight: '100svh',
        },
      }}
    >
      <SignedOutHeader />
      {children}
      <Footer />
    </Grid>
  )
}
