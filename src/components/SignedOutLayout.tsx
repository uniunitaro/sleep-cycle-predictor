import { ReactElement } from 'react'
import SignedOutHeader from './SignedOutHeader'

const SignedOutLayout = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <SignedOutHeader />
      {children}
    </>
  )
}

export default SignedOutLayout
