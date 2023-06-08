import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormControl,
  // FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { getApp } from 'firebase/app'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'
import PasswordField from '@/components/PasswordField/PasswordField'
import SignedOutLayout from '@/components/SignedOutLayout/SignedOutLayout'
import AuthFormCard from '@/features/auths/components/AuthFormCard/AuthFormCard'

// const schema = z.object({
//   email: z
//     .string()
//     .email({ message: 'メールアドレスの形式が正しくありません' }),
//   password: z
//     .string()
//     .min(8, { message: 'パスワードは8文字以上で入力してください' })
//     .regex(
//       /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
//       'パスワードは英字と数字をどちらも含む必要があります'
//     ),
// })
type Schema = { email: string; password: string }

const SignIn: NextPageWithLayout = () => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<Schema>()

  const [error, setError] = useState<boolean>(false)

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const auth = getAuth(getApp())
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (e) {
      setError(true)
    }
  }

  return (
    <>
      <Head>
        <title>ログイン - Sleep Cycle Predictor</title>
      </Head>
      <Container
        maxW="lg"
        py={{ base: '4', md: '8' }}
        px={{ base: '0', md: '8' }}
      >
        <AuthFormCard>
          <Stack spacing="7">
            <Heading size="lg" fontWeight="normal" textAlign="center">
              ログイン
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing="10">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">メールアドレス</FormLabel>
                    <Input id="email" type="email" {...register('email')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">パスワード</FormLabel>
                    <PasswordField id="password" {...register('password')} />
                  </FormControl>
                </Stack>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    メールアドレスまたはパスワードが間違っています。
                  </Alert>
                )}
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  ログイン
                </Button>
              </Stack>
            </form>
          </Stack>
        </AuthFormCard>
      </Container>
    </>
  )
}

SignIn.getLayout = (page) => <SignedOutLayout>{page}</SignedOutLayout>

export default withAuthUser<NextPageWithLayout>({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RENDER,
})(SignIn)
