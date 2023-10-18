import { format, isValid, parse } from 'date-fns'
import { useEffect, useRef, useState } from 'react'

export const useTimeInput = ({
  date,
  hourRef,
  minuteRef,
}: {
  date: Date
  hourRef: React.RefObject<HTMLInputElement>
  minuteRef: React.RefObject<HTMLInputElement>
}) => {
  const [hour, setHour] = useState(format(date, 'HH'))
  const [minute, setMinute] = useState(format(date, 'mm'))

  const oldValue = useRef(date)

  useEffect(() => {
    if (
      hourRef.current !== document.activeElement &&
      minuteRef.current !== document.activeElement
    ) {
      // フォーカスされていなければ更新する、フォーカス時に空文字にする処理と競合しないため
      setHour(format(date, 'HH'))
      setMinute(format(date, 'mm'))
    }
    oldValue.current = date
  }, [date, hourRef, minuteRef])

  const getHalfWidthNumber = (value: string) => {
    // 全角か半角の数字のみ許可
    if (!/^[0-9０-９]+$/.test(value)) {
      return ''
    }

    // 全角の数字を半角に変換
    const halfWidthValue = value.replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 65248)
    )
    return halfWidthValue
  }

  const handleChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const halfWidthNumber = getHalfWidthNumber(e.target.value)
    setHour(halfWidthNumber)
  }

  const prevHourLength = useRef(0)
  useEffect(() => {
    // handleChangeHour内でフォーカスを移すとhourが更新される前にsetAndReturnValidTimeが
    // 呼ばれてしまうため、仕方なくuseEffectでフォーカスを移す

    if (prevHourLength.current === 1 && hour.length === 2) {
      minuteRef.current?.focus()
    }

    prevHourLength.current = hour.length
  }, [hour, minuteRef])

  const handleChangeMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    const halfWidthNumber = getHalfWidthNumber(e.target.value)
    setMinute(halfWidthNumber)
  }

  const setAndReturnValidTime = (): Date | undefined => {
    const parsedDate = parse(`${hour}:${minute}`, 'HH:mm', new Date())
    if (!isValid(parsedDate)) {
      setHour(format(oldValue.current, 'HH'))
      setMinute(format(oldValue.current, 'mm'))
      return
    }

    setHour(format(parsedDate, 'HH'))
    setMinute(format(parsedDate, 'mm'))
    oldValue.current = parsedDate
    return parsedDate
  }

  return {
    hour,
    minute,
    setHour,
    setMinute,
    handleChangeHour,
    handleChangeMinute,
    setAndReturnValidTime,
  }
}
