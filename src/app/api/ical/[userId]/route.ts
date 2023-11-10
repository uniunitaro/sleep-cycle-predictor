import { addYears } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { generateICal } from '@/features/sleep/server/generateICal'
import { getPredictions } from '@/features/sleep/repositories/predictions'

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

  const { iCalData, error: iCalError } = generateICal(predictions)
  if (iCalError) {
    return NextResponse.json({ error: true }, { status: 500 })
  }

  return new Response(iCalData, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  })
}
