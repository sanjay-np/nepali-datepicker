/**
 * Date Formatting Utilities
 * Format and parse Nepali dates with multilingual support
 */

import type { NepaliDate } from './date-converter'
import { NEPALI_MONTHS, NEPALI_DAYS, NEPALI_NUMERALS } from './nepali-date-data'

export type Language = 'ne' | 'en'

/**
 * Convert a number to Nepali numerals
 */
export function toNepaliNumeral(num: number): string {
    return num
        .toString()
        .split('')
        .map(digit => NEPALI_NUMERALS[parseInt(digit)] || digit)
        .join('')
}

/**
 * Format a BS date according to a pattern
 * Supported tokens:
 * - YYYY: Full year (e.g., 2081)
 * - YY: Two-digit year (e.g., 81)
 * - MMMM: Full month name (e.g., Baisakh)
 * - MMM: Short month name (e.g., Bai)
 * - MM: Two-digit month (e.g., 01)
 * - M: Month number (e.g., 1)
 * - DD: Two-digit day (e.g., 01)
 * - D: Day number (e.g., 1)
 * - dddd: Full day name (e.g., Sunday)
 * - ddd: Short day name (e.g., Sun)
 */
export function formatBsDate(
    date: NepaliDate,
    format: string = 'YYYY-MM-DD',
    language: Language = 'en'
): string {
    const pad = (n: number): string => n.toString().padStart(2, '0')
    const formatNum = (n: number): string =>
        language === 'ne' ? toNepaliNumeral(n) : n.toString()
    const formatNumPad = (n: number): string =>
        language === 'ne' ? toNepaliNumeral(n).padStart(2, NEPALI_NUMERALS[0]) : pad(n)

    let result = format

    // Use placeholders to avoid replacing tokens inside already-replaced values
    // (e.g., 'MM' in 'Magh' should not be replaced with month number)
    // Placeholders must not contain any letters (M, D, Y, etc.)
    const FULL_MONTH_PLACEHOLDER = '\u0000\u0001\u0002\u0003\u0000'
    const SHORT_MONTH_PLACEHOLDER = '\u0000\u0004\u0005\u0006\u0000'

    // Month names first (replace with placeholders to protect them)
    result = result.replace('MMMM', FULL_MONTH_PLACEHOLDER)
    result = result.replace('MMM', SHORT_MONTH_PLACEHOLDER)

    // Year
    result = result.replace('YYYY', formatNum(date.year))
    result = result.replace('YY', formatNum(date.year % 100))

    // Month numbers (safe now since month names are placeholders)
    result = result.replace('MM', formatNumPad(date.month))
    result = result.replace(/(?<!M)M(?!M)/, formatNum(date.month))

    // Day
    result = result.replace('DD', formatNumPad(date.day))
    result = result.replace(/(?<!D)D(?!D)/, formatNum(date.day))

    // Replace placeholders with actual month names
    result = result.replace(FULL_MONTH_PLACEHOLDER, NEPALI_MONTHS[language][date.month - 1])
    result = result.replace(SHORT_MONTH_PLACEHOLDER, NEPALI_MONTHS[language][date.month - 1].slice(0, 3))

    return result
}

/**
 * Parse a date string to NepaliDate
 * Assumes format: YYYY-MM-DD
 */
export function parseBsDate(dateString: string): NepaliDate | null {
    const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (!match) return null

    return {
        year: parseInt(match[1]),
        month: parseInt(match[2]),
        day: parseInt(match[3])
    }
}

/**
 * Get month name in specified language
 */
export function getMonthName(month: number, language: Language = 'en'): string {
    return NEPALI_MONTHS[language][month - 1] || ''
}

/**
 * Get day name in specified language
 */
export function getDayName(dayOfWeek: number, language: Language = 'en'): string {
    return NEPALI_DAYS[language][dayOfWeek] || ''
}

/**
 * Get all month names
 */
export function getMonthNames(language: Language = 'en'): string[] {
    return [...NEPALI_MONTHS[language]]
}

/**
 * Get all day names (short)
 */
export function getDayNames(language: Language = 'en'): string[] {
    return [...NEPALI_DAYS[language]]
}

// ============================================
// String Utility Functions
// ============================================

import { getTodayBs, bsToAd, adToBs } from './date-converter'

/**
 * Get today's BS date as a formatted string
 * @example
 * getTodayBsString() // "2082-10-06"
 * getTodayBsString('MMMM D, YYYY', 'en') // "Magh 6, 2082"
 * getTodayBsString('MMMM D, YYYY', 'ne') // "माघ ६, २०८२"
 */
export function getTodayBsString(format: string = 'YYYY-MM-DD', language: Language = 'en'): string {
    const today = getTodayBs()
    return formatBsDate(today, format, language)
}

/**
 * Convert BS date to AD and return as formatted string
 * @example
 * bsToAdString(2082, 10, 6) // "2026-01-20"
 * bsToAdString(2082, 10, 6, 'MMMM D, YYYY') // "January 20, 2026"
 */
export function bsToAdString(
    year: number,
    month: number,
    day: number,
    format: string = 'YYYY-MM-DD'
): string {
    const adDate = bsToAd(year, month, day)
    return formatAdDate(adDate, format)
}

/**
 * Convert AD date to BS and return as formatted string
 * @example
 * adToBsString(2026, 1, 20) // "2082-10-06"
 * adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'en') // "Magh 6, 2082"
 * adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne') // "माघ ६, २०८२"
 */
export function adToBsString(
    year: number,
    month: number,
    day: number,
    format: string = 'YYYY-MM-DD',
    language: Language = 'en'
): string {
    const bsDate = adToBs(year, month, day)
    return formatBsDate(bsDate, format, language)
}

/**
 * Format an AD (English) date
 * @example
 * formatAdDate({year: 2026, month: 1, day: 20}, 'YYYY-MM-DD') // "2026-01-20"
 * formatAdDate({year: 2026, month: 1, day: 20}, 'MMMM D, YYYY') // "January 20, 2026"
 */
export function formatAdDate(
    date: { year: number; month: number; day: number },
    format: string = 'YYYY-MM-DD'
): string {
    const pad = (n: number): string => n.toString().padStart(2, '0')

    const AD_MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    let result = format

    // Use placeholders to avoid conflicts
    const MONTH_NAME_PLACEHOLDER = '\u0000\u0001\u0002\u0003\u0000'
    const MONTH_SHORT_PLACEHOLDER = '\u0000\u0004\u0005\u0006\u0000'

    result = result.replace('MMMM', MONTH_NAME_PLACEHOLDER)
    result = result.replace('MMM', MONTH_SHORT_PLACEHOLDER)

    // Year
    result = result.replace('YYYY', date.year.toString())
    result = result.replace('YY', (date.year % 100).toString())

    // Month numbers
    result = result.replace('MM', pad(date.month))
    result = result.replace(/(?<!M)M(?!M)/, date.month.toString())

    // Day
    result = result.replace('DD', pad(date.day))
    result = result.replace(/(?<!D)D(?!D)/, date.day.toString())

    // Replace placeholders with month names
    result = result.replace(MONTH_NAME_PLACEHOLDER, AD_MONTHS[date.month - 1])
    result = result.replace(MONTH_SHORT_PLACEHOLDER, AD_MONTHS[date.month - 1].slice(0, 3))

    return result
}

/**
 * Get BS date string from NepaliDate object
 * @example
 * getBsDateString({year: 2082, month: 10, day: 6}) // "2082-10-06"
 * getBsDateString({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY') // "Magh 6, 2082"
 */
export function getBsDateString(
    date: NepaliDate,
    format: string = 'YYYY-MM-DD',
    language: Language = 'en'
): string {
    return formatBsDate(date, format, language)
}
