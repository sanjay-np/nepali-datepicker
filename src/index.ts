/**
 * Nepali Date Picker Library
 * 
 * A modern React component library for selecting Nepali (Bikram Sambat) dates
 * with full date conversion utilities between BS and AD calendars.
 * 
 * @example
 * ```tsx
 * // Basic Usage - Date Picker Component
 * import { NepaliDatePicker } from 'nepali-datepicker'
 * import 'nepali-datepicker/styles.css'
 * 
 * function App() {
 *   const [date, setDate] = useState()
 *   return <NepaliDatePicker value={date} onChange={setDate} />
 * }
 * ```
 */

// Import styles
import './index.css'

// ============================================
// Component Exports
// ============================================

/**
 * NepaliDatePicker - Main date picker component with popover
 * 
 * @example
 * ```tsx
 * import { NepaliDatePicker } from 'nepali-datepicker'
 * 
 * <NepaliDatePicker
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
export { NepaliDatePicker, NepaliDatePickerWithToday } from './components/NepaliDatePicker'
export type { NepaliDatePickerProps } from './components/NepaliDatePicker'

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
export { Calendar } from './components/NepaliDatePicker/Calendar'
export type { CalendarProps } from './components/NepaliDatePicker/Calendar'

// ============================================
// Type Exports
// ============================================

/**
 * NepaliDate - Represents a date in Bikram Sambat calendar
 * @example
 * ```ts
 * const date: NepaliDate = { year: 2082, month: 10, day: 6 }
 * ```
 * 
 * EnglishDate - Represents a date in Gregorian calendar
 * @example
 * ```ts
 * const date: EnglishDate = { year: 2026, month: 1, day: 20 }
 * ```
 */
export type { NepaliDate, EnglishDate } from './lib/date-converter'

/**
 * Language - Supported languages ('en' | 'ne')
 */
export type { Language } from './lib/date-formatter'

// ============================================
// Date Conversion Utilities
// ============================================

/**
 * bsToAd - Convert Bikram Sambat date to Gregorian (AD) date
 * 
 * @example
 * ```ts
 * import { bsToAd } from 'nepali-datepicker'
 * 
 * const adDate = bsToAd(2082, 10, 6)
 * // Result: { year: 2026, month: 1, day: 20 }
 * ```
 * 
 * adToBs - Convert Gregorian (AD) date to Bikram Sambat date
 * 
 * @example
 * ```ts
 * import { adToBs } from 'nepali-datepicker'
 * 
 * const bsDate = adToBs(2026, 1, 20)
 * // Result: { year: 2082, month: 10, day: 6 }
 * ```
 * 
 * getTodayBs - Get today's date in Bikram Sambat
 * 
 * @example
 * ```ts
 * import { getTodayBs } from 'nepali-datepicker'
 * 
 * const today = getTodayBs()
 * // Result: { year: 2082, month: 10, day: 6 } (as of Magh 6, 2082)
 * ```
 * 
 * getDaysInBsMonth - Get number of days in a BS month
 * 
 * @example
 * ```ts
 * import { getDaysInBsMonth } from 'nepali-datepicker'
 * 
 * const days = getDaysInBsMonth(2082, 10)  // Magh 2082
 * // Result: 29
 * ```
 * 
 * isValidBsDate - Check if a BS date is valid
 * 
 * @example
 * ```ts
 * import { isValidBsDate } from 'nepali-datepicker'
 * 
 * isValidBsDate(2082, 10, 6)   // true
 * isValidBsDate(2082, 13, 35)  // false (invalid month and day)
 * ```
 * 
 * compareBsDates - Compare two BS dates (-1, 0, 1)
 * 
 * @example
 * ```ts
 * import { compareBsDates } from 'nepali-datepicker'
 * 
 * const date1 = { year: 2082, month: 10, day: 6 }
 * const date2 = { year: 2082, month: 10, day: 15 }
 * 
 * compareBsDates(date1, date2)  // -1 (date1 < date2)
 * compareBsDates(date2, date1)  // 1  (date2 > date1)
 * compareBsDates(date1, date1)  // 0  (equal)
 * ```
 * 
 * isBsDateInRange - Check if a date is within a range
 * 
 * @example
 * ```ts
 * import { isBsDateInRange } from 'nepali-datepicker'
 * 
 * const date = { year: 2082, month: 10, day: 6 }
 * const minDate = { year: 2082, month: 1, day: 1 }
 * const maxDate = { year: 2082, month: 12, day: 30 }
 * 
 * isBsDateInRange(date, minDate, maxDate)  // true
 * ```
 */
export {
    bsToAd,
    adToBs,
    getTodayBs,
    getDaysInBsMonth,
    getFirstDayOfBsMonth,
    isValidBsDate,
    compareBsDates,
    isBsDateInRange,
} from './lib/date-converter'

// ============================================
// Date Formatting Utilities
// ============================================

/**
 * formatBsDate - Format a BS date with custom format string
 * 
 * Supported tokens:
 * - YYYY: Full year (2082)
 * - YY: Two-digit year (82)
 * - MMMM: Full month name (Magh / माघ)
 * - MMM: Short month name (Mag)
 * - MM: Two-digit month (10)
 * - M: Month number (10)
 * - DD: Two-digit day (06)
 * - D: Day number (6)
 * 
 * @example
 * ```ts
 * import { formatBsDate } from 'nepali-datepicker'
 * 
 * const date = { year: 2082, month: 10, day: 6 }
 * 
 * formatBsDate(date, 'YYYY-MM-DD', 'en')     // "2082-10-06"
 * formatBsDate(date, 'MMMM D, YYYY', 'en')   // "Magh 6, 2082"
 * formatBsDate(date, 'MMMM D, YYYY', 'ne')   // "माघ ६, २०८२"
 * formatBsDate(date, 'D/M/YYYY', 'en')       // "6/10/2082"
 * ```
 * 
 * parseBsDate - Parse a date string (YYYY-MM-DD) to NepaliDate
 * 
 * @example
 * ```ts
 * import { parseBsDate } from 'nepali-datepicker'
 * 
 * const date = parseBsDate('2082-10-06')
 * // Result: { year: 2082, month: 10, day: 6 }
 * ```
 * 
 * toNepaliNumeral - Convert number to Nepali numerals
 * 
 * @example
 * ```ts
 * import { toNepaliNumeral } from 'nepali-datepicker'
 * 
 * toNepaliNumeral(2082)   // "२०८२"
 * toNepaliNumeral(123)    // "१२३"
 * ```
 * 
 * getMonthName - Get month name in specified language
 * 
 * @example
 * ```ts
 * import { getMonthName } from 'nepali-datepicker'
 * 
 * getMonthName(10, 'en')  // "Magh"
 * getMonthName(10, 'ne')  // "माघ"
 * getMonthName(1, 'en')   // "Baisakh"
 * ```
 * 
 * getMonthNames - Get all month names
 * 
 * @example
 * ```ts
 * import { getMonthNames } from 'nepali-datepicker'
 * 
 * getMonthNames('en')  
 * // ["Baisakh", "Jestha", "Ashar", "Shrawan", "Bhadra", "Ashwin", 
 * //  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"]
 * ```
 * 
 * getDayName - Get day name by day of week (0=Sunday)
 * 
 * @example
 * ```ts
 * import { getDayName } from 'nepali-datepicker'
 * 
 * getDayName(0, 'en')  // "Sun"
 * getDayName(0, 'ne')  // "आइत"
 * ```
 */
export {
    formatBsDate,
    parseBsDate,
    toNepaliNumeral,
    getMonthName,
    getDayName,
    getMonthNames,
    getDayNames,
} from './lib/date-formatter'

// ============================================
// String Utility Functions
// ============================================

/**
 * getTodayBsString - Get today's BS date as a formatted string
 * 
 * @example
 * ```ts
 * import { getTodayBsString } from 'nepali-datepicker'
 * 
 * getTodayBsString()                      // "2082-10-06"
 * getTodayBsString('MMMM D, YYYY', 'en')  // "Magh 6, 2082"
 * getTodayBsString('MMMM D, YYYY', 'ne')  // "माघ ६, २०८२"
 * ```
 * 
 * bsToAdString - Convert BS date to AD and return as formatted string
 * 
 * @example
 * ```ts
 * import { bsToAdString } from 'nepali-datepicker'
 * 
 * bsToAdString(2082, 10, 6)                  // "2026-01-20"
 * bsToAdString(2082, 10, 6, 'MMMM D, YYYY')  // "January 20, 2026"
 * ```
 * 
 * adToBsString - Convert AD date to BS and return as formatted string
 * 
 * @example
 * ```ts
 * import { adToBsString } from 'nepali-datepicker'
 * 
 * adToBsString(2026, 1, 20)                        // "2082-10-06"
 * adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'en')  // "Magh 6, 2082"
 * adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne')  // "माघ ६, २०८२"
 * ```
 * 
 * formatAdDate - Format an AD (English) date with custom format
 * 
 * @example
 * ```ts
 * import { formatAdDate } from 'nepali-datepicker'
 * 
 * formatAdDate({year: 2026, month: 1, day: 20}, 'YYYY-MM-DD')    // "2026-01-20"
 * formatAdDate({year: 2026, month: 1, day: 20}, 'MMMM D, YYYY')  // "January 20, 2026"
 * ```
 * 
 * getBsDateString - Get BS date string from NepaliDate object
 * 
 * @example
 * ```ts
 * import { getBsDateString } from 'nepali-datepicker'
 * 
 * getBsDateString({year: 2082, month: 10, day: 6})                        // "2082-10-06"
 * getBsDateString({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'ne')  // "माघ ६, २०८२"
 * ```
 */
export {
    getTodayBsString,
    bsToAdString,
    adToBsString,
    formatAdDate,
    getBsDateString,
} from './lib/date-formatter'

// ============================================
// Data Constants
// ============================================

/**
 * NEPALI_MONTHS - Month names in both languages
 * 
 * @example
 * ```ts
 * import { NEPALI_MONTHS } from 'nepali-datepicker'
 * 
 * NEPALI_MONTHS.en[9]  // "Magh" (10th month, 0-indexed)
 * NEPALI_MONTHS.ne[9]  // "माघ"
 * ```
 * 
 * NEPALI_DAYS - Short day names (Sun-Sat)
 * 
 * @example
 * ```ts
 * import { NEPALI_DAYS } from 'nepali-datepicker'
 * 
 * NEPALI_DAYS.en  // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
 * NEPALI_DAYS.ne  // ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"]
 * ```
 * 
 * NEPALI_NUMERALS - Nepali digit characters
 * 
 * @example
 * ```ts
 * import { NEPALI_NUMERALS } from 'nepali-datepicker'
 * 
 * NEPALI_NUMERALS  // ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
 * ```
 * 
 * BS_MIN_YEAR / BS_MAX_YEAR - Supported year range
 * 
 * @example
 * ```ts
 * import { BS_MIN_YEAR, BS_MAX_YEAR } from 'nepali-datepicker'
 * 
 * BS_MIN_YEAR  // 2000
 * BS_MAX_YEAR  // 2100
 * ```
 */
export {
    NEPALI_MONTHS,
    NEPALI_DAYS,
    NEPALI_DAYS_FULL,
    NEPALI_NUMERALS,
    BS_MIN_YEAR,
    BS_MAX_YEAR,
} from './lib/nepali-date-data'
