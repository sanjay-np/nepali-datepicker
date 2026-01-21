import { forwardRef, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CalendarIcon } from '@/components/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getTodayBs } from '@/lib'
import type { NepaliDate } from '@/lib/date-converter'
import { formatBsDate } from '@/lib/date-formatter'
import { cn } from '@/lib/utils'

import { Calendar } from './calendar'
import type { CalendarProps } from './calendar'

/**
 * Props for the Picker component.
 */
export interface PickerProps extends Omit<CalendarProps, 'selected' | 'onSelect'> {
  /** The currently selected Nepali date. */
  value?: NepaliDate
  /** Callback triggered when a new date is selected. */
  onChange?: (date: NepaliDate | undefined) => void
  /** Callback triggered when the component loses focus. */
  onBlur?: () => void
  /** Name of the field for form integration. */
  name?: string
  /** Unique ID for the component. */
  id?: string
  /** Placeholder text shown when no date is selected. */
  placeholder?: string
  /** The format pattern used to display the date in the trigger. */
  dateFormat?: string
  /** Whether the date picker is disabled. */
  disabled?: boolean
  /** Additional CSS classes for the trigger button. */
  className?: string
  /** Additional CSS classes for the calendar component inside popover. */
  calendarClassName?: string
  /** Whether to automatically close the popover after selection. */
  closeOnSelect?: boolean
}

/**
 * A modern Nepali Date Picker component with native form and React Hook Form support.
 */
export const Picker = forwardRef<HTMLButtonElement, PickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      id,
      placeholder = 'Pick a date',
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

    const handleSelect = useCallback(
      (date: NepaliDate) => {
        onChange?.(date)
        if (closeOnSelect) {
          setOpen(false)
        }
      },
      [onChange, closeOnSelect]
    )

    const displayValue = value ? formatBsDate(value, dateFormat, language) : null
    const hiddenValue = value ? formatBsDate(value, 'YYYY-MM-DD', 'en') : ''

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
            id={id}
            variant="outline"
            type="button"
            disabled={disabled}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !value && 'text-muted-foreground-ndp',
              className
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <CalendarIcon className="mr-2" />
            {displayValue ?? <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        {/* Hidden input for native form compatibility */}
        {name && <input type="hidden" name={name} value={hiddenValue} />}

        <PopoverContent className="p-0" align="start">
          <Calendar
            selected={value}
            onSelect={handleSelect}
            language={language}
            minDate={minDate}
            maxDate={maxDate}
            captionLayout={captionLayout}
            defaultMonth={value}
            className={calendarClassName}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

Picker.displayName = 'Picker'

/**
 * Props for the PickerWithToday component.
 */
export interface PickerWithTodayProps extends PickerProps {
  /** Additional CSS classes for the container div. */
  containerClassName?: string
  /** Additional CSS classes for the "Today" button. */
  todayButtonClassName?: string
}

/**
 * A variant of the Picker that includes a "Today" shortcut button.
 */
export function PickerWithToday({
  containerClassName = '',
  todayButtonClassName = '',
  ...props
}: PickerWithTodayProps) {
  const handleTodayClick = () => {
    const today = getTodayBs()
    props.onChange?.(today)
  }

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      <Picker {...props} closeOnSelect={false} />
      <Button
        variant="ghost"
        type="button"
        size="sm"
        onClick={handleTodayClick}
        className={cn('h-7 self-start text-xs', todayButtonClassName)}
      >
        Today
      </Button>
    </div>
  )
}

export { DateRangePicker } from './date-range-picker'
export type { DateRangePickerProps } from './date-range-picker'

export default Picker
