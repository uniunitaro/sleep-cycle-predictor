import SignedOutHeader from '@/components/SignedOutHeader/SignedOutHeader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SignedOutHeader />
      {children}
    </>
  )
}
