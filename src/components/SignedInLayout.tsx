import { ReactElement } from 'react'
import SignedInHeader from './SignedInHeader'

const SignedInLayout = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <SignedInHeader />
      {children}
    </>
  )
}

export default SignedInLayout
