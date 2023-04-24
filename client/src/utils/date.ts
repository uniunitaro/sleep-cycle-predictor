import { format as DateFormat } from 'date-fns'

export const validateDate = (
  dateStr: string,
  format = 'yyyy-MM-dd'
): boolean => {
  const d = new Date(dateStr)
  try {
    const formatDate = DateFormat(d, format)
    return dateStr === formatDate
  } catch (error) {
    return false
  }
}
