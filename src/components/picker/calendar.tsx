import { useCallback, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import {
  BS_MAX_YEAR,
  BS_MIN_YEAR,
  compareBsDates,
  getDaysInBsMonth,
  getFirstDayOfBsMonth,
  getTodayBs,
  isBsDateInRange,
} from '@/lib'
import type { NepaliDate } from '@/lib/date-converter'
import type { Language } from '@/lib/date-formatter'
import { formatBsDate, getDayNames, getMonthNames, toNepaliNumeral } from '@/lib/date-formatter'

import { ChevronLeft, ChevronRight } from '@/components/ui/icons'

/**
 * Represents a range of Nepali dates.
 */
export type DateRange = {
  /** The start of the range */
  from?: NepaliDate
  /** The end of the range */
  to?: NepaliDate
}

/**
 * Props for the Calendar component.
 */
export interface CalendarProps {
  /**
   * Selection mode. 'single' for selecting one date, 'range' for a start and end date.
   * @default 'single'
   */
  mode?: 'single' | 'range'
  /** Selected date for single mode */
  selected?: NepaliDate
  /** Callback when a date is selected in single mode */
  onSelect?: (date: NepaliDate) => void
  /** Selected range for range mode */
  selectedRange?: DateRange
  /** Callback when a range is selected in range mode */
  onRangeSelect?: (range: DateRange) => void
  /** Minimum selectable date */
  minDate?: NepaliDate
  /** Maximum selectable date */
  maxDate?: NepaliDate
  /**
   * Display language for month names, day names, and numerals.
   * @default 'en'
   */
  language?: Language
  /** The month initially displayed in the calendar */
  defaultMonth?: NepaliDate
  /** Additional CSS classes for the container */
  className?: string
  /**
   * Strategy for displaying the month/year selection.
   * @default 'buttons'
   */
  captionLayout?: 'buttons' | 'dropdown'
}

/**
 * A highly customizable Nepali (Bikram Sambat) Calendar component.
 * Supports both single date and range selection, localized display, and custom constraints.
 */
export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  selectedRange,
  onRangeSelect,
  minDate,
  maxDate,
  language = 'en',
  defaultMonth,
  className = '',
  captionLayout = 'buttons',
}: CalendarProps) {
  const today = useMemo(() => getTodayBs(), [])

  // View state tracks which month/year the user is currently looking at
  const [viewDate, setViewDate] = useState<NepaliDate>(() => ({
    year: defaultMonth?.year ?? selected?.year ?? selectedRange?.from?.year ?? today.year,
    month: defaultMonth?.month ?? selected?.month ?? selectedRange?.from?.month ?? today.month,
    day: 1,
  }))

  const monthNames = useMemo(() => getMonthNames(language), [language])
  const dayNames = useMemo(() => getDayNames(language), [language])

  const daysInMonth = useMemo(
    () => getDaysInBsMonth(viewDate.year, viewDate.month),
    [viewDate.year, viewDate.month]
  )

  const firstDayOfWeek = useMemo(
    () => getFirstDayOfBsMonth(viewDate.year, viewDate.month),
    [viewDate.year, viewDate.month]
  )

  // Generate accurate list of days for the current view, including padding for the first week
  const calendarDays = useMemo(() => {
    const days: (NepaliDate | null)[] = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ year: viewDate.year, month: viewDate.month, day })
    }

    return days
  }, [viewDate.year, viewDate.month, daysInMonth, firstDayOfWeek])

  const goToPreviousMonth = useCallback(() => {
    setViewDate((prev) => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12, day: 1 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setViewDate((prev) => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1, day: 1 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  }, [])

  const handleDateSelect = useCallback(
    (date: NepaliDate) => {
      if (!isBsDateInRange(date, minDate, maxDate)) return

      if (mode === 'single') {
        onSelect?.(date)
      } else if (mode === 'range') {
        if (!selectedRange?.from || (selectedRange.from && selectedRange.to)) {
          // New range start
          onRangeSelect?.({ from: date, to: undefined })
        } else {
          // Range completion logic
          const comp = compareBsDates(date, selectedRange.from)
          if (comp < 0) {
            onRangeSelect?.({ from: date, to: selectedRange.from })
          } else {
            onRangeSelect?.({ from: selectedRange.from, to: date })
          }
        }
      }
    },
    [mode, onSelect, onRangeSelect, selectedRange, minDate, maxDate]
  )

  const isToday = useCallback(
    (date: NepaliDate) => {
      return compareBsDates(date, today) === 0
    },
    [today]
  )

  const isSelected = useCallback(
    (date: NepaliDate) => {
      if (mode === 'single') {
        return selected ? compareBsDates(date, selected) === 0 : false
      }
      if (mode === 'range' && selectedRange) {
        const { from, to } = selectedRange
        const isFrom = from ? compareBsDates(date, from) === 0 : false
        const isTo = to ? compareBsDates(date, to) === 0 : false
        return isFrom || isTo
      }
      return false
    },
    [mode, selected, selectedRange]
  )

  const isInRangeView = useCallback(
    (date: NepaliDate) => {
      if (mode === 'range' && selectedRange?.from && selectedRange?.to) {
        return isBsDateInRange(date, selectedRange.from, selectedRange.to)
      }
      return false
    },
    [mode, selectedRange]
  )

  const isDisabled = useCallback(
    (date: NepaliDate) => {
      return !isBsDateInRange(date, minDate, maxDate)
    },
    [minDate, maxDate]
  )

  // Localized formatting helpers
  const formatDayNumber = (day: number) =>
    language === 'ne' ? toNepaliNumeral(day) : day.toString()

  const formatYear = (year: number) => (language === 'ne' ? toNepaliNumeral(year) : year.toString())

  const yearOptions = useMemo(() => {
    const years: number[] = []
    const start = Math.max(BS_MIN_YEAR, minDate?.year ?? BS_MIN_YEAR)
    const end = Math.min(BS_MAX_YEAR, maxDate?.year ?? BS_MAX_YEAR)
    for (let y = start; y <= end; y++) {
      years.push(y)
    }
    return years
  }, [minDate, maxDate])

  const isPrevDisabled =
    minDate && viewDate.year === minDate.year && viewDate.month <= minDate.month
  const isNextDisabled =
    maxDate && viewDate.year === maxDate.year && viewDate.month >= maxDate.month

  return (
    <div className={cn('p-3', className)}>
      {/* Header: Month and Year Selection */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          disabled={!!isPrevDisabled}
          aria-label="Previous month"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronLeft />
        </Button>

        {captionLayout === 'dropdown' ? (
          <div className="flex items-center gap-1 font-medium">
            <select
              value={viewDate.month}
              onChange={(e) =>
                setViewDate((prev) => ({ ...prev, month: parseInt(e.target.value) }))
              }
              className="rounded-ndp border-input-ndp bg-background-ndp focus:ring-ring-ndp h-7 border px-2 text-sm font-medium focus:ring-1 focus:outline-none"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={viewDate.year}
              onChange={(e) => setViewDate((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
              className="rounded-ndp border-input-ndp bg-background-ndp focus:ring-ring-ndp h-7 border px-2 text-sm font-medium focus:ring-1 focus:outline-none"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {formatYear(year)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-sm font-medium">
            {monthNames[viewDate.month - 1]} {formatYear(viewDate.year)}
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          disabled={!!isNextDisabled}
          aria-label="Next month"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Week Headers: Sun, Mon, etc. */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {dayNames.map((day, idx) => (
          <div
            key={idx}
            className="text-muted-foreground-ndp flex h-8 w-8 items-center justify-center text-[0.8rem] font-normal"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarDays.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8 w-8" />
          }

          const dayIsToday = isToday(date)
          const dayIsSelected = isSelected(date)
          const dayIsInRange = isInRangeView(date)
          const dayIsDisabled = isDisabled(date)

          const buttonClasses = cn(
            'flex h-8 w-8 items-center justify-center rounded-ndp text-sm transition-colors cursor-pointer border-none bg-transparent hover:bg-accent-ndp hover:text-accent-foreground-ndp focus:outline-none focus:ring-1 focus:ring-ring-ndp',
            dayIsSelected && 'bg-primary-ndp! text-primary-foreground-ndp!',
            dayIsInRange &&
            !dayIsSelected &&
            'bg-accent-ndp text-accent-foreground-ndp rounded-none',
            dayIsToday &&
            !dayIsSelected &&
            !dayIsInRange &&
            'bg-accent-ndp text-accent-foreground-ndp',
            dayIsDisabled &&
            'text-muted-foreground-ndp! opacity-50 cursor-default pointer-events-none'
          )

          return (
            <button
              key={`${date.year}-${date.month}-${date.day}`}
              type="button"
              onClick={() => handleDateSelect(date)}
              disabled={dayIsDisabled}
              className={buttonClasses}
              aria-label={formatBsDate(date, 'YYYY MMMM D', language)}
              aria-selected={dayIsSelected}
            >
              {formatDayNumber(date.day)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
