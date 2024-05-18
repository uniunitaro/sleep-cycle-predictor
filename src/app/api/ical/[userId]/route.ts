import { addYears } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { generateICal } from '@/features/sleep/server/generateICal'
import { getPredictions } from '@/features/sleep/repositories/predictions'
import { getUser } from '@/features/user/repositories/users'

export const runtime = 'edge'

export const GET = async (
  _request: NextRequest,
  context: { params: { userId: string } }
) => {
  const { predictions, error } = await getPredictions({
    userId: context.params.userId,
    start: new Date(),
    end: addYears(new Date(), 1),
  })
  if (error) {
    return NextResponse.json({ error: true }, { status: 500 })
  }

  const { user, error: userError } = await getUser(context.params.userId)
  if (userError) {
    return NextResponse.json({ error: true }, { status: 500 })
  }

  const { iCalData, error: iCalError } = generateICal({
    predictions,
    userName: user.nickname,
  })
  if (iCalError) {
    return NextResponse.json({ error: true }, { status: 500 })
  }

  return new Response(iCalData, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  })
}
