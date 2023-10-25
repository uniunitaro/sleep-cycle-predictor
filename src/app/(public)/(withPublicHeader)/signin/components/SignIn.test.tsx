import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import * as supabase from '@supabase/auth-helpers-nextjs'
import SignIn from './SignIn'

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  __esModule: true,
  createClientComponentClient: jest.fn(),
}))

describe('SignIn', () => {
  test('誤った形式のメールアドレス、パスワードを入れるとエラーが表示される', async () => {
    render(<SignIn />)

    const emailField = screen.getByLabelText('メールアドレス')
    const passwordField = screen.getByLabelText('パスワード')
    const loginButton = screen.getByRole('button', {
      name: 'メールアドレスでログイン',
    })

    await userEvent.type(emailField, 'invalid-email')
    await userEvent.type(passwordField, 'invalid-password')
    await userEvent.click(loginButton)

    expect(
      await screen.findByText('メールアドレスの形式が正しくありません')
    ).toBeInTheDocument()

    expect(
      await screen.findByText(
        'パスワードは英字と数字をどちらも含む必要があります'
      )
    ).toBeInTheDocument()

    await userEvent.clear(passwordField)
    await userEvent.type(passwordField, 'short1')
    await userEvent.click(loginButton)

    expect(
      await screen.findByText('パスワードは8文字以上で入力してください')
    ).toBeInTheDocument()
  })

  test.each([
    [
      'Invalid login credentials',
      'メールアドレスまたはパスワードが間違っています。',
    ],
    ['Email not confirmed', 'メールアドレスの確認が完了していません。'],
    ['Other error', 'エラーが発生しました。'],
  ])(
    'ログインに失敗するとエラーが表示される',
    async (errorMessage, displayMessage) => {
      jest.spyOn(supabase, 'createClientComponentClient').mockReturnValue({
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            error: {
              message: errorMessage,
            },
          }),
        },
      } as any)

      render(<SignIn />)

      const emailField = screen.getByLabelText('メールアドレス')
      const passwordField = screen.getByLabelText('パスワード')
      const loginButton = screen.getByRole('button', {
        name: 'メールアドレスでログイン',
      })
      await userEvent.type(emailField, 'example@example.com')
      await userEvent.type(passwordField, 'pass0000')

      await userEvent.click(loginButton)

      expect(await screen.findByRole('alert')).toHaveTextContent(displayMessage)
    }
  )
})
