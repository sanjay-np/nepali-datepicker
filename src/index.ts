/**
 * @fileoverview Nepali Date Picker Library
 *
 * A modern, lightweight, and highly customizable React component library for selecting
 * Nepali (Bikram Sambat) dates. Built with React 19, Tailwind CSS v4, and TypeScript.
 *
 * Features:
 * - Single and Range date selection
 * - Full date conversion between BS and AD calendars
 * - Multi-language support (English and Nepali)
 * - Accessible UI with keyboard support
 * - Tree-shakable exports
 *
 * @see {@link https://github.com/munatech/nepali-datepicker} for documentation and examples.
 *
 * @example
 * ```tsx
 * import { Picker } from '@munatech/nepali-datepicker'
 * import '@munatech/nepali-datepicker/dist/style.css'
 *
 * function MyComponent() {
 *   const [date, setDate] = useState({ year: 2082, month: 10, day: 6 })
 *   return <Picker value={date} onChange={setDate} />
 * }
 * ```
 */
// Import styles
import './index.css'

// ============================================
// Component Exports
// ============================================

/**
 * Picker - Main date picker component with popover
 *
 * @example
 * ```tsx
 * import { Picker } from 'nepali-datepicker'
 *
 * <Picker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   language="en"                    // 'en' | 'ne'
 *   placeholder="Pick a date"
 *   dateFormat="YYYY-MM-DD"          // Format for display
 *   captionLayout="buttons"          // 'buttons' | 'dropdown'
 *   minDate={{ year: 2080, month: 1, day: 1 }}
 *   maxDate={{ year: 2085, month: 12, day: 30 }}
 * />
 * ```
 */
export {
  Picker,
  PickerWithToday,
  DateRangePicker,
} from '@/components/picker'
export type {
  PickerProps,
  PickerWithTodayProps,
  DateRangePickerProps,
} from '@/components/picker'

/**
 * Calendar - Standalone calendar component
 *
 * @example
 * ```tsx
 * import { Calendar } from 'nepali-datepicker'
 *
 * <Calendar
 *   selected={selectedDate}
 *   onSelect={setSelectedDate}
 *   language="ne"
 * />
 * ```
 */
export { Calendar } from '@/components/picker/calendar'
export type { CalendarProps, DateRange } from '@/components/picker/calendar'

// ============================================
// Type Exports
// ============================================

/**
 * NepaliDate - Represents a date in Bikram Sambat calendar
 */
export type { NepaliDate, EnglishDate } from '@/lib/date-converter'

/**
 * Language - Supported languages ('en' | 'ne')
 */
export type { Language } from '@/lib/date-formatter'

// ============================================
// Date Conversion Utilities
// ============================================

export {
  bsToAd,
  adToBs,
  getTodayBs,
  getDaysInBsMonth,
  getFirstDayOfBsMonth,
  isValidBsDate,
  compareBsDates,
  isBsDateInRange,
} from '@/lib/date-converter'

// ============================================
// Date Formatting Utilities
// ============================================

export {
  formatBsDate,
  parseBsDate,
  toNepaliNumeral,
  getMonthName,
  getDayName,
  getMonthNames,
  getDayNames,
} from '@/lib/date-formatter'

// ============================================
// String Utility Functions
// ============================================

export {
  getTodayBsString,
  bsToAdString,
  adToBsString,
  formatAdDate,
  getBsDateString,
} from '@/lib/date-formatter'

// ============================================
// Data Constants
// ============================================

export {
  NEPALI_MONTHS,
  NEPALI_DAYS,
  NEPALI_DAYS_FULL,
  NEPALI_NUMERALS,
  BS_MIN_YEAR,
  BS_MAX_YEAR,
} from '@/lib/nepali-date-data'

// ============================================
// General Utilities
// ============================================
export { cn } from '@/lib/utils'
