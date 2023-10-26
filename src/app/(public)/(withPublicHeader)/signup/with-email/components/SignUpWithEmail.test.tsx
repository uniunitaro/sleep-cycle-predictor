import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import SignUpWithEmail from './SignUpWithEmail'
import * as signUp from '@/features/auth/server/signUp'

jest.mock('@/features/auth/server/signUp', () => ({
  __esModule: true,
  signUp: jest.fn(),
}))

describe('SignUpWithEmail', () => {
  test('誤った形式のニックネーム、メールアドレス、パスワードを入れるとエラーが表示される', async () => {
    render(<SignUpWithEmail />)

    const emailField = screen.getByLabelText('メールアドレス')
    const passwordField = screen.getByLabelText('パスワード')
    const loginButton = screen.getByRole('button', {
      name: '登録する',
    })

    await userEvent.type(emailField, 'invalid-email')
    await userEvent.type(passwordField, 'invalid-password')
    await userEvent.click(loginButton)

    expect(
      await screen.findByText('ニックネームを入力してください')
    ).toBeInTheDocument()

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

  test('登録に失敗するとエラーが表示される', async () => {
    jest.spyOn(signUp, 'signUp').mockResolvedValue({
      error: true,
    })

    render(<SignUpWithEmail />)

    const nicknameField = screen.getByLabelText('ニックネーム')
    const emailField = screen.getByLabelText('メールアドレス')
    const passwordField = screen.getByLabelText('パスワード')
    const loginButton = screen.getByRole('button', {
      name: '登録する',
    })

    await userEvent.type(nicknameField, 'example')
    await userEvent.type(emailField, 'example@example.com')
    await userEvent.type(passwordField, 'pass0000')

    await userEvent.click(loginButton)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'エラーが発生しました。'
    )
  })
})
