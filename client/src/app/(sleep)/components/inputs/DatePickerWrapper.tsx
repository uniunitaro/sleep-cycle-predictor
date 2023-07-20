import { DatePicker, DatePickerProps } from 'chakra-datetime-picker'
import { FC, memo } from 'react'

const DatePickerWrapper: FC<DatePickerProps> = memo((props) => {
  return <DatePicker {...props} />
})

DatePickerWrapper.displayName = 'DatePickerWrapper'
export default DatePickerWrapper
