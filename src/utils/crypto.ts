// https://www.clear-code.com/blog/2019/1/30.html

const generateKey = async (password: string, salt?: Uint8Array) => {
  // 文字列をTyped Arrayに変換する
  const passwordUint8Array = new TextEncoder().encode(password)

  // パスワードのハッシュ値を計算する。
  const digest = await crypto.subtle.digest(
    // ハッシュ値の計算に用いるアルゴリズム
    { name: 'SHA-256' },
    passwordUint8Array
  )

  // 生パスワードからのハッシュ値から、salt付きでハッシュ化するための素材を得る
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'PBKDF2' },
    // 鍵のエクスポートを許可するかどうかの指定。falseでエクスポートを禁止する
    false,
    // 鍵の用途。ここでは、「鍵の変換に使う」と指定している
    ['deriveKey']
  )

  // saltがない場合作成する
  const newSalt = salt ?? crypto.getRandomValues(new Uint8Array(16))

  // 素材にsaltを付与して、最終的なWeb Crypto API用の鍵に変換する
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: newSalt,
      iterations: 100000, // ストレッチングの回数
      hash: 'SHA-256',
    },
    keyMaterial,
    // アルゴリズム
    { name: 'AES-GCM', length: 256 },
    // 鍵のエクスポートを禁止する
    false,
    // 鍵の用途は、「データの暗号化と復号に使う」と指定
    ['encrypt', 'decrypt']
  )

  return { key, salt: newSalt }
}

export const encrypt = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  if (process.env.CRYPTO_PASSWORD === undefined) {
    throw new Error('CRYPTO_PASSWORD is not defined')
  }
  const { key, salt } = await generateKey(`${process.env.CRYPTO_PASSWORD}`)

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  )

  // salt, iv, encryptedをbase64エンコードしてカンマ区切りで連結
  const saltBase64 = btoa(String.fromCharCode.apply(null, Array.from(salt)))
  const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)))
  const encryptedBase64 = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(encrypted)))
  )

  const base64 = [saltBase64, ivBase64, encryptedBase64].join(',')
  return base64
}

export const decrypt = async (encrypted: string): Promise<string> => {
  const [saltBase64, ivBase64, encryptedBase64] = encrypted.split(',')

  const salt = new Uint8Array(
    atob(saltBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  )
  const iv = new Uint8Array(
    atob(ivBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  )
  const encryptedData = new Uint8Array(
    atob(encryptedBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  )

  if (process.env.CRYPTO_PASSWORD === undefined) {
    throw new Error('CRYPTO_PASSWORD is not defined')
  }
  const { key } = await generateKey(`${process.env.CRYPTO_PASSWORD}`, salt)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}
