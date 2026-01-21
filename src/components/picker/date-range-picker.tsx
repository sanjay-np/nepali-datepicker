import { forwardRef, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CalendarIcon } from '@/components/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatBsDate } from '@/lib/date-formatter'
import { cn } from '@/lib/utils'

import { Calendar } from './calendar'
import type { CalendarProps, DateRange } from './calendar'

/**
 * Props for the DateRangePicker component.
 */
export interface DateRangePickerProps
  extends Omit<CalendarProps, 'selected' | 'onSelect' | 'selectedRange' | 'onRangeSelect' | 'mode'> {
  /** The currently selected date range { from, to }. */
  value?: DateRange
  /** Callback triggered when the range changes. */
  onChange?: (range: DateRange | undefined) => void
  /** Callback triggered when the component loses focus. */
  onBlur?: () => void
  /** Name for the 'from' date field. */
  nameFrom?: string
  /** Name for the 'to' date field. */
  nameTo?: string
  /** Placeholder text. */
  placeholder?: string
  /** Date display format. */
  dateFormat?: string
  /** Whether disabled. */
  disabled?: boolean
  /** Extra CSS classes. */
  className?: string
  /** Extra CSS classes for the calendar. */
  calendarClassName?: string
  /** Close popover on range completion. */
  closeOnSelect?: boolean
}

/**
 * A modern Nepali Date Range Picker component with native form and React Hook Form support.
 */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      nameFrom,
      nameTo,
      placeholder = 'Pick a date range',
      dateFormat = 'YYYY-MM-DD',
      disabled = false,
      className = '',
      calendarClassName = '',
      closeOnSelect = true,
      language = 'en',
      minDate,
      maxDate,
      captionLayout = 'buttons',
      ...calendarProps
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)

    const handleRangeSelect = useCallback(
      (range: DateRange) => {
        onChange?.(range)
        if (closeOnSelect && range.from && range.to) {
          setOpen(false)
        }
      },
      [onChange, closeOnSelect]
    )

    const displayValue = value?.from
      ? `${formatBsDate(value.from, dateFormat, language)}${value.to ? ` - ${formatBsDate(value.to, dateFormat, language)}` : ' - ...'}`
      : null

    const hiddenValueFrom = value?.from ? formatBsDate(value.from, 'YYYY-MM-DD', 'en') : ''
    const hiddenValueTo = value?.to ? formatBsDate(value.to, 'YYYY-MM-DD', 'en') : ''

    return (
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
          if (!newOpen) onBlur?.()
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            type="button"
            disabled={disabled}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value?.from && 'text-muted-foreground-ndp',
              className
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <CalendarIcon className="mr-2" />
            {displayValue ?? <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        {/* Hidden inputs for native form compatibility */}
        {nameFrom && <input type="hidden" name={nameFrom} value={hiddenValueFrom} />}
        {nameTo && <input type="hidden" name={nameTo} value={hiddenValueTo} />}

        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="range"
            selectedRange={value}
            onRangeSelect={handleRangeSelect}
            language={language}
            minDate={minDate}
            maxDate={maxDate}
            captionLayout={captionLayout}
            defaultMonth={value?.from}
            className={calendarClassName}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'

export default DateRangePicker
