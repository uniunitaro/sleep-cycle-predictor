'use server'

import { AwsClient } from 'aws4fetch'
import { v4 as uuidv4 } from 'uuid'
import { updateAuthUser } from '../repositories/users'

export const updateAvatar = async (
  dataUrl: string,
  existingAvatarUrl?: string
): Promise<{ error?: true }> => {
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  })

  const r2Url = process.env.R2_URL!
  const bucket = 'sleep-predictor-images'
  const uuid = uuidv4()
  const objectKey = `avatars/${uuid}.jpg`
  const imageUrl = `${r2Url}/${bucket}/${objectKey}`

  const blob = await fetch(dataUrl).then((res) => res.blob())
  try {
    const res = await client.fetch(imageUrl, {
      body: blob,
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })
    if (!res.ok) {
      throw new Error('failed to upload image')
    }

    const publicDomain = 'https://images.sleep-predictor.com/'
    if (existingAvatarUrl) {
      const existingObjectKey = existingAvatarUrl.replace(publicDomain, '')
      const existingR2ImageUrl = `${r2Url}/${bucket}/${existingObjectKey}`
      const res2 = await client.fetch(existingR2ImageUrl, {
        method: 'DELETE',
      })
      if (!res2.ok) {
        throw new Error('failed to delete existing image')
      }
    }

    const avatarUrl = publicDomain + objectKey
    const { error } = await updateAuthUser({ avatarUrl })
    if (error) throw error

    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}
