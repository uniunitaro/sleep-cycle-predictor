import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from './_app'
import { PasswordField } from '@/components/PasswordField'
import Layout from '@/components/Layout'
import { firebaseApp } from '@/libs/firebase'

const schema = z.object({
  email: z
    .string()
    .email({ message: 'メールアドレスの形式が正しくありません' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(
      /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      'パスワードは英字と数字をどちらも含む必要があります'
    ),
})
type Schema = z.infer<typeof schema>

const SignUp: NextPageWithLayout = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ mode: 'onBlur', resolver: zodResolver(schema) })

  const router = useRouter()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    console.log(data)
    const auth = getAuth(firebaseApp)
    await createUserWithEmailAndPassword(auth, data.email, data.password)

    router.push('/')
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '4', md: '8' }}
      px={{ base: '4', md: '12' }}
    >
      <Stack spacing="7">
        <Heading size="lg" fontWeight="normal" textAlign="center">
          新規会員登録
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing="10">
            <Stack spacing="5">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">メールアドレス</FormLabel>
                <Input id="email" type="email" {...register('email')} />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">パスワード</FormLabel>
                <PasswordField {...register('password')} />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Button colorScheme="green" type="submit" isLoading={isSubmitting}>
              登録する
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}

SignUp.getLayout = (page) => <Layout>{page}</Layout>

export default SignUp
