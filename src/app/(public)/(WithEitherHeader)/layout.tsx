import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SignedInHeader from '@/components/SignedInHeader/SignedInHeader'
import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'
import { Flex } from '@/components/chakra'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthed = !!session
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
      {isAuthed ? <SignedInHeader /> : <SignedOutHeader />}
      {children}
    </Flex>
  )
}
