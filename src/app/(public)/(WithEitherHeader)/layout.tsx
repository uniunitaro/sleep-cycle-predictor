import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Grid } from '@chakra-ui/react'
import SignedInHeader from '@/components/SignedInHeader/SignedInHeader'
import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'
import Footer from '@/components/Footer'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthed = !!session
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
      {isAuthed ? <SignedInHeader /> : <SignedOutHeader />}
      {children}
      <Footer />
    </Grid>
  )
}
