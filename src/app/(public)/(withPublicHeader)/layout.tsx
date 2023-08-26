import Footer from '@/components/Footer'
import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'
import { Grid } from '@/components/chakra'

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
