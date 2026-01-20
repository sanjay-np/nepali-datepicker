import { useState, useMemo, useCallback } from 'react'
import type { NepaliDate } from '../../lib/date-converter'
import type { Language } from '../../lib/date-formatter'
import {
    getDaysInBsMonth,
    getFirstDayOfBsMonth,
    getTodayBs,
    compareBsDates,
    isBsDateInRange,
    BS_MIN_YEAR,
    BS_MAX_YEAR,
} from '../../lib'
import {
    formatBsDate,
    getMonthNames,
    getDayNames,
    toNepaliNumeral,
} from '../../lib/date-formatter'
import { Button } from '../ui/Button'

// Icons as simple SVG components
const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
)

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
)

export interface CalendarProps {
    /** Selected date */
    selected?: NepaliDate
    /** Callback when a date is selected */
    onSelect?: (date: NepaliDate) => void
    /** Minimum selectable date */
    minDate?: NepaliDate
    /** Maximum selectable date */
    maxDate?: NepaliDate
    /** Language for display */
    language?: Language
    /** Initial month to display */
    defaultMonth?: NepaliDate
    /** Additional CSS classes */
    className?: string
    /** Caption layout: buttons or dropdown for month/year selection */
    captionLayout?: 'buttons' | 'dropdown'
}

export function Calendar({
    selected,
    onSelect,
    minDate,
    maxDate,
    language = 'en',
    defaultMonth,
    className = '',
    captionLayout = 'buttons',
}: CalendarProps) {
    const today = useMemo(() => getTodayBs(), [])

    const [viewDate, setViewDate] = useState<NepaliDate>(() => ({
        year: defaultMonth?.year ?? selected?.year ?? today.year,
        month: defaultMonth?.month ?? selected?.month ?? today.month,
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

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const days: (NepaliDate | null)[] = []

        // Empty cells before first day
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ year: viewDate.year, month: viewDate.month, day })
        }

        return days
    }, [viewDate.year, viewDate.month, daysInMonth, firstDayOfWeek])

    const goToPreviousMonth = useCallback(() => {
        setViewDate(prev => {
            if (prev.month === 1) {
                return { year: prev.year - 1, month: 12, day: 1 }
            }
            return { ...prev, month: prev.month - 1 }
        })
    }, [])

    const goToNextMonth = useCallback(() => {
        setViewDate(prev => {
            if (prev.month === 12) {
                return { year: prev.year + 1, month: 1, day: 1 }
            }
            return { ...prev, month: prev.month + 1 }
        })
    }, [])

    const handleDateSelect = useCallback((date: NepaliDate) => {
        if (isBsDateInRange(date, minDate, maxDate)) {
            onSelect?.(date)
        }
    }, [onSelect, minDate, maxDate])

    const isToday = useCallback((date: NepaliDate) => {
        return compareBsDates(date, today) === 0
    }, [today])

    const isSelected = useCallback((date: NepaliDate) => {
        return selected ? compareBsDates(date, selected) === 0 : false
    }, [selected])

    const isDisabled = useCallback((date: NepaliDate) => {
        return !isBsDateInRange(date, minDate, maxDate)
    }, [minDate, maxDate])

    const formatDayNumber = (day: number) =>
        language === 'ne' ? toNepaliNumeral(day) : day.toString()

    const formatYear = (year: number) =>
        language === 'ne' ? toNepaliNumeral(year) : year.toString()

    // Generate year options for dropdown
    const yearOptions = useMemo(() => {
        const years: number[] = []
        const start = Math.max(BS_MIN_YEAR, (minDate?.year ?? BS_MIN_YEAR))
        const end = Math.min(BS_MAX_YEAR, (maxDate?.year ?? BS_MAX_YEAR))
        for (let y = start; y <= end; y++) {
            years.push(y)
        }
        return years
    }, [minDate, maxDate])

    return (
        <div className={`ndp-calendar ${className}`.trim()}>
            {/* Header with navigation */}
            <div className="ndp-calendar-header">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                    disabled={minDate && viewDate.year === minDate.year && viewDate.month <= minDate.month}
                    aria-label="Previous month"
                    className="ndp-calendar-nav-btn"
                >
                    <ChevronLeft />
                </Button>

                {captionLayout === 'dropdown' ? (
                    <div className="flex items-center gap-1">
                        <select
                            value={viewDate.month}
                            onChange={(e) => setViewDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                            className="ndp-calendar-select"
                        >
                            {monthNames.map((name, idx) => (
                                <option key={idx} value={idx + 1}>{name}</option>
                            ))}
                        </select>
                        <select
                            value={viewDate.year}
                            onChange={(e) => setViewDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                            className="ndp-calendar-select"
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {formatYear(year)}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="ndp-calendar-caption">
                        {monthNames[viewDate.month - 1]} {formatYear(viewDate.year)}
                    </div>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextMonth}
                    disabled={maxDate && viewDate.year === maxDate.year && viewDate.month >= maxDate.month}
                    aria-label="Next month"
                    className="ndp-calendar-nav-btn"
                >
                    <ChevronRight />
                </Button>
            </div>

            {/* Day headers */}
            <div className="ndp-calendar-grid">
                {dayNames.map((day, idx) => (
                    <div
                        key={idx}
                        className="ndp-calendar-day-header"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="ndp-calendar-grid">
                {calendarDays.map((date, idx) => {
                    if (!date) {
                        return <div key={`empty-${idx}`} style={{ width: '2rem', height: '2rem' }} />
                    }

                    const dayIsToday = isToday(date)
                    const dayIsSelected = isSelected(date)
                    const dayIsDisabled = isDisabled(date)

                    const buttonClasses = [
                        'ndp-calendar-day',
                        dayIsSelected ? 'ndp-calendar-day-selected' : '',
                        dayIsToday && !dayIsSelected ? 'ndp-calendar-day-today' : '',
                        dayIsDisabled ? 'ndp-calendar-day-disabled' : '',
                    ].filter(Boolean).join(' ')

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
