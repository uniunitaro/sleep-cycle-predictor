import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  DatePicker as _DatePicker,
  DatePickerColumnHeader,
  DatePickerContent,
  DatePickerDayCell,
  DatePickerDayCellTrigger,
  DatePickerGrid,
  DatePickerMonthCell,
  DatePickerMonthCellTrigger,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerRow,
  DatePickerRowGroup,
  DatePickerRowHeader,
  DatePickerViewTrigger,
  DatePickerYearCell,
  DatePickerYearCellTrigger,
  type DatePickerProps,
} from './park/DatePicker'
import { IconButton, Button } from './chakra'
import { Stack } from 'styled-system/jsx'

const DatePicker = (props: DatePickerProps & { disableFocus?: boolean }) => {
  const { disableFocus, ...rest } = props
  return (
    <_DatePicker
      inline
      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      {...rest}
    >
      {(api) => (
        <>
          <DatePickerContent bgColor="transparent" px="2">
            <Stack gap="3">
              <Stack justify="space-between" direction="row">
                <DatePickerPrevTrigger asChild>
                  <IconButton
                    variant="ghost"
                    aria-label="前の月へ"
                    icon={<ChevronLeftIcon color="secondaryGray" boxSize="5" />}
                    tabIndex={disableFocus ? -1 : undefined}
                  ></IconButton>
                </DatePickerPrevTrigger>
                <DatePickerViewTrigger asChild>
                  <Button
                    variant="ghost"
                    tabIndex={disableFocus ? -1 : undefined}
                  >
                    {api.view === 'day' && api.visibleRangeText.start}
                    {api.view === 'month' && api.visibleRange.start.year}
                    {api.view === 'year' &&
                      `${api.getDecade().start} - ${api.getDecade().end}`}
                  </Button>
                </DatePickerViewTrigger>
                <DatePickerNextTrigger asChild>
                  <IconButton
                    variant="ghost"
                    aria-label="次の月へ"
                    icon={
                      <ChevronRightIcon color="secondaryGray" boxSize="5" />
                    }
                    tabIndex={disableFocus ? -1 : undefined}
                  ></IconButton>
                </DatePickerNextTrigger>
              </Stack>
              {api.view === 'day' && (
                <DatePickerGrid>
                  <DatePickerRowHeader>
                    {api.weekDays.map((day, i) => (
                      <DatePickerColumnHeader key={i} aria-label={day.long}>
                        {day.narrow}
                      </DatePickerColumnHeader>
                    ))}
                  </DatePickerRowHeader>
                  <DatePickerRowGroup>
                    {api.weeks.map((week, id) => (
                      <DatePickerRow key={id}>
                        {week.map((day, id) => (
                          <DatePickerDayCell key={id} value={day}>
                            <DatePickerDayCellTrigger asChild>
                              <Button
                                variant="ghost"
                                px="0"
                                tabIndex={disableFocus ? -1 : undefined}
                                _selected={{
                                  bg: 'buttonBrand',
                                  color: 'chakra-inverse-text',
                                }}
                                onClick={(e) => {
                                  // data-selectedがtrueな場合閉じる
                                  if (
                                    e.currentTarget.getAttribute(
                                      'data-selected'
                                    ) === ''
                                  ) {
                                    console.log('uhi')
                                    props.onChange?.({ value: [day] })
                                  }
                                }}
                                onKeyDown={
                                  // data-selectedがtrueな場合閉じる
                                  (e) => {
                                    if (
                                      e.currentTarget.getAttribute(
                                        'data-selected'
                                      ) === ''
                                    ) {
                                      if (e.key === 'Enter') {
                                        props.onChange?.({ value: [day] })
                                      }
                                    }
                                  }
                                }
                              >
                                {day.day}
                              </Button>
                            </DatePickerDayCellTrigger>
                          </DatePickerDayCell>
                        ))}
                      </DatePickerRow>
                    ))}
                  </DatePickerRowGroup>
                </DatePickerGrid>
              )}
              {api.view === 'month' && (
                <DatePickerGrid>
                  <DatePickerRowGroup>
                    {api
                      .getMonthsGrid({ columns: 4, format: 'short' })
                      .map((months, row) => (
                        <DatePickerRow key={row}>
                          {months.map((month, index) => (
                            <DatePickerMonthCell
                              key={index}
                              value={month.value}
                            >
                              <DatePickerMonthCellTrigger asChild>
                                <Button variant="ghost">{month.label}</Button>
                              </DatePickerMonthCellTrigger>
                            </DatePickerMonthCell>
                          ))}
                        </DatePickerRow>
                      ))}
                  </DatePickerRowGroup>
                </DatePickerGrid>
              )}
              {api.view === 'year' && (
                <DatePickerGrid>
                  <DatePickerRowGroup>
                    {api.getYearsGrid({ columns: 4 }).map((years, row) => (
                      <DatePickerRow key={row}>
                        {years.map((year, index) => (
                          <DatePickerYearCell key={index} value={year.value}>
                            <DatePickerYearCellTrigger>
                              <Button variant="ghost">{year.label}</Button>
                            </DatePickerYearCellTrigger>
                          </DatePickerYearCell>
                        ))}
                      </DatePickerRow>
                    ))}
                  </DatePickerRowGroup>
                </DatePickerGrid>
              )}
            </Stack>
          </DatePickerContent>
        </>
      )}
    </_DatePicker>
  )
}

export default DatePicker
