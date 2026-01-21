// Type exports (separate for ESM compatibility)
export type { NepaliDate, EnglishDate } from './date-converter'
export type { Language } from './date-formatter'

// Core utilities
export {
  bsToAd,
  adToBs,
  getTodayBs,
  getDaysInBsMonth,
  getFirstDayOfBsMonth,
  isValidBsDate,
  compareBsDates,
  isBsDateInRange,
} from './date-converter'

// Formatting utilities
export {
  formatBsDate,
  parseBsDate,
  toNepaliNumeral,
  getMonthName,
  getDayName,
  getMonthNames,
  getDayNames,
  getTodayBsString,
  bsToAdString,
  adToBsString,
  formatAdDate,
  getBsDateString,
} from './date-formatter'

// General utilities
export { cn } from './utils'

// Data exports
export {
  NEPALI_MONTHS,
  NEPALI_DAYS,
  NEPALI_DAYS_FULL,
  NEPALI_NUMERALS,
  BS_MIN_YEAR,
  BS_MAX_YEAR,
} from './nepali-date-data'
