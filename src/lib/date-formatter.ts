/**
 * @fileoverview Date Formatting Utilities
 *
 * Provides functions to format and parse Nepali dates with multilingual support (English and Nepali).
 * Includes utility functions for converting numbers to Nepali numerals and handling common date string operations.
 */
import type { EnglishDate, NepaliDate } from '@/lib/date-converter'
import { adToBs, bsToAd, getTodayBs } from '@/lib/date-converter'
import { NEPALI_DAYS, NEPALI_MONTHS, NEPALI_NUMERALS } from '@/lib/nepali-date-data'

/** Supported languages for date display */
export type Language = 'ne' | 'en'

/**
 * Converts standard Arabic numerals to Nepali numerals.
 *
 * @example
 * toNepaliNumeral(2082) // Returns "२०८२"
 *
 * @param num - The number to convert
 * @returns A string containing the equivalent Nepali numerals
 */
export function toNepaliNumeral(num: number): string {
  return num
    .toString()
    .split('')
    .map((digit) => NEPALI_NUMERALS[parseInt(digit)] || digit)
    .join('')
}

/**
 * Formats a Bikram Sambat (BS) date based on a pattern.
 *
 * Supported tokens:
 * - `YYYY`: Full year (e.g., 2081 or २०८१)
 * - `YY`: Two-digit year (e.g., 81 or ८१)
 * - `MMMM`: Full month name (e.g., Baisakh or बैशाख)
 * - `MMM`: Short month name (e.g., Bai or बैशा)
 * - `MM`: Two-digit month number (e.g., 01 or ०१)
 * - `M`: Month number (e.g., 1 or १)
 * - `DD`: Two-digit day number (e.g., 01 or ०१)
 * - `D`: Day number (e.g., 1 or १)
 *
 * @example
 * formatBsDate({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'ne') // "माघ ६, २०८२"
 *
 * @param date - The NepaliDate object to format
 * @param format - The format pattern string (default: 'YYYY-MM-DD')
 * @param language - Output language (default: 'en')
 * @returns Formatted date string
 */
export function formatBsDate(
  date: NepaliDate,
  format: string = 'YYYY-MM-DD',
  language: Language = 'en'
): string {
  const pad = (n: number): string => n.toString().padStart(2, '0')
  const formatNum = (n: number): string => (language === 'ne' ? toNepaliNumeral(n) : n.toString())
  const formatNumPad = (n: number): string =>
    language === 'ne' ? toNepaliNumeral(n).padStart(2, NEPALI_NUMERALS[0]) : pad(n)

  let result = format

  // Placeholders to protect already-replaced tokens from recursive replacement
  const FULL_MONTH_PLACEHOLDER = '\u0000\u0001\u0002\u0003\u0000'
  const SHORT_MONTH_PLACEHOLDER = '\u0000\u0004\u0005\u0006\u0000'

  result = result.replace('MMMM', FULL_MONTH_PLACEHOLDER)
  result = result.replace('MMM', SHORT_MONTH_PLACEHOLDER)

  // Year replacement
  result = result.replace('YYYY', formatNum(date.year))
  result = result.replace('YY', formatNum(date.year % 100))

  // Month replacement
  result = result.replace('MM', formatNumPad(date.month))
  result = result.replace(/(?<!M)M(?!M)/, formatNum(date.month))

  // Day replacement
  result = result.replace('DD', formatNumPad(date.day))
  result = result.replace(/(?<!D)D(?!D)/, formatNum(date.day))

  // Final placeholder replacement with month names
  const monthIndex = date.month - 1
  result = result.replace(FULL_MONTH_PLACEHOLDER, NEPALI_MONTHS[language][monthIndex])
  result = result.replace(SHORT_MONTH_PLACEHOLDER, NEPALI_MONTHS[language][monthIndex].slice(0, 3))

  return result
}

/**
 * Parses a date string in `YYYY-MM-DD` format into a NepaliDate object.
 *
 * @param dateString - String to parse (e.g., "2082-10-06")
 * @returns NepaliDate object or null if parsing fails
 */
export function parseBsDate(dateString: string): NepaliDate | null {
  const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return null

  return {
    year: parseInt(match[1]),
    month: parseInt(match[2]),
    day: parseInt(match[3]),
  }
}

/**
 * Gets the localized name of a Bikram Sambat month.
 *
 * @param month - Month number (1-12)
 * @param language - Language ('ne' or 'en')
 * @returns Month name
 */
export function getMonthName(month: number, language: Language = 'en'): string {
  return NEPALI_MONTHS[language][month - 1] || ''
}

/**
 * Gets the localized short name of a day of the week.
 *
 * @param dayOfWeek - Day index (0=Sunday, 6=Saturday)
 * @param language - Language ('ne' or 'en')
 * @returns Localized day name
 */
export function getDayName(dayOfWeek: number, language: Language = 'en'): string {
  return NEPALI_DAYS[language][dayOfWeek] || ''
}

/**
 * Returns an array of allLocalized month names for a given language.
 *
 * @param language - Language ('ne' or 'en')
 * @returns Array of 12 month names
 */
export function getMonthNames(language: Language = 'en'): string[] {
  return [...NEPALI_MONTHS[language]]
}

/**
 * Returns an array of all localized short day names for a given language.
 *
 * @param language - Language ('ne' or 'en')
 * @returns Array of 7 day names
 */
export function getDayNames(language: Language = 'en'): string[] {
  return [...NEPALI_DAYS[language]]
}

/**
 * Gets today's BS date as a formatted string.
 *
 * @param format - Output format pattern
 * @param language - Output language
 * @returns Formatted today's date string
 */
export function getTodayBsString(format: string = 'YYYY-MM-DD', language: Language = 'en'): string {
  return formatBsDate(getTodayBs(), format, language)
}

/**
 * Converts a BS date to an AD date string.
 *
 * @param year - BS Year
 * @param month - BS Month
 * @param day - BS Day
 * @param format - Format for AD date output
 * @returns Formatted AD date string
 */
export function bsToAdString(
  year: number,
  month: number,
  day: number,
  format: string = 'YYYY-MM-DD'
): string {
  return formatAdDate(bsToAd(year, month, day), format)
}

/**
 * Converts an AD date to a BS date string.
 *
 * @param year - AD Year
 * @param month - AD Month
 * @param day - AD Day
 * @param format - Format for BS date output
 * @param language - Language for output
 * @returns Formatted BS date string
 */
export function adToBsString(
  year: number,
  month: number,
  day: number,
  format: string = 'YYYY-MM-DD',
  language: Language = 'en'
): string {
  return formatBsDate(adToBs(year, month, day), format, language)
}

/**
 * Formats a Gregorian (AD) date object using a pattern.
 *
 * @param date - EnglishDate object { year, month, day }
 * @param format - Pattern string
 * @returns Formatted AD string
 */
export function formatAdDate(date: EnglishDate, format: string = 'YYYY-MM-DD'): string {
  const pad = (n: number): string => n.toString().padStart(2, '0')

  const AD_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  let result = format

  const MONTH_NAME_PLACEHOLDER = '\u0000\u0001\u0002\u0003\u0000'
  const MONTH_SHORT_PLACEHOLDER = '\u0000\u0004\u0005\u0006\u0000'

  result = result.replace('MMMM', MONTH_NAME_PLACEHOLDER)
  result = result.replace('MMM', MONTH_SHORT_PLACEHOLDER)

  result = result.replace('YYYY', date.year.toString())
  result = result.replace('YY', (date.year % 100).toString())

  result = result.replace('MM', pad(date.month))
  result = result.replace(/(?<!M)M(?!M)/, date.month.toString())

  result = result.replace('DD', pad(date.day))
  result = result.replace(/(?<!D)D(?!D)/, date.day.toString())

  result = result.replace(MONTH_NAME_PLACEHOLDER, AD_MONTHS[date.month - 1])
  result = result.replace(MONTH_SHORT_PLACEHOLDER, AD_MONTHS[date.month - 1].slice(0, 3))

  return result
}

/**
 * Convenience function to format a NepaliDate object.
 * Alias for formatBsDate.
 *
 * @param date - The NepaliDate object
 * @param format - Format pattern
 * @param language - Output language
 * @returns Formatted string
 */
export function getBsDateString(
  date: NepaliDate,
  format: string = 'YYYY-MM-DD',
  language: Language = 'en'
): string {
  return formatBsDate(date, format, language)
}
