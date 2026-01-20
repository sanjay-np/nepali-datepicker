import { useState, useCallback } from 'react'
import type { NepaliDate } from '../../lib/date-converter'
import { getTodayBs } from '../../lib'
import { formatBsDate } from '../../lib/date-formatter'
import { Button } from '../ui/Button'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/Popover'
import { Calendar } from './Calendar'
import type { CalendarProps } from './Calendar'

// Calendar icon
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ndp-mr-2">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
    </svg>
)

export interface NepaliDatePickerProps extends Omit<CalendarProps, 'selected' | 'onSelect'> {
    /** Selected date value */
    value?: NepaliDate
    /** Callback when date changes */
    onChange?: (date: NepaliDate | undefined) => void
    /** Placeholder text when no date selected */
    placeholder?: string
    /** Date format for display */
    dateFormat?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Additional classes for the trigger button */
    className?: string
    /** Whether to close popover on date select */
    closeOnSelect?: boolean
}

export function NepaliDatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    dateFormat = 'YYYY-MM-DD',
    disabled = false,
    className = '',
    closeOnSelect = true,
    language = 'en',
    minDate,
    maxDate,
    captionLayout = 'buttons',
    ...calendarProps
}: NepaliDatePickerProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = useCallback((date: NepaliDate) => {
        onChange?.(date)
        if (closeOnSelect) {
            setOpen(false)
        }
    }, [onChange, closeOnSelect])

    const displayValue = value
        ? formatBsDate(value, dateFormat, language)
        : null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    disabled={disabled}
                    className={`
                        ndp-w-datepicker ndp-justify-start ndp-text-left ndp-font-normal
                        ${!value ? 'ndp-text-muted' : ''}
                        ${className}
                    `.replace(/\s+/g, ' ').trim()}
                >
                    <CalendarIcon />
                    {displayValue ?? <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="ndp-p-0" align="start">
                <Calendar
                    selected={value}
                    onSelect={handleSelect}
                    language={language}
                    minDate={minDate}
                    maxDate={maxDate}
                    captionLayout={captionLayout}
                    defaultMonth={value}
                    {...calendarProps}
                />
            </PopoverContent>
        </Popover>
    )
}

// Export a version with "today" button
export function NepaliDatePickerWithToday(props: NepaliDatePickerProps) {
    const handleTodayClick = () => {
        const today = getTodayBs()
        props.onChange?.(today)
    }

    return (
        <div className="ndp-flex-col ndp-gap-2">
            <NepaliDatePicker {...props} closeOnSelect={false} />
            <Button
                variant="ghost"
                type="button"
                size="sm"
                onClick={handleTodayClick}
                className="ndp-self-start"
            >
                Today
            </Button>
        </div>
    )
}

export default NepaliDatePicker
