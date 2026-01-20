/**
 * Date Converter Utilities
 * Convert between Bikram Sambat (BS) and Gregorian (AD) calendars
 */

import {
    BS_CALENDAR_DATA,
    BS_REFERENCE,
    AD_REFERENCE,
    BS_MIN_YEAR,
    BS_MAX_YEAR,
} from './nepali-date-data'

export interface NepaliDate {
    year: number
    month: number // 1-12
    day: number   // 1-32
}

export interface EnglishDate {
    year: number
    month: number // 1-12
    day: number   // 1-31
}

/**
 * Get total days in a BS year
 */
export function getTotalDaysInBsYear(year: number): number {
    const monthDays = BS_CALENDAR_DATA[year]
    if (!monthDays) {
        throw new Error(`BS year ${year} is not supported. Supported range: ${BS_MIN_YEAR}-${BS_MAX_YEAR}`)
    }
    return monthDays.reduce((sum, days) => sum + days, 0)
}

/**
 * Get days in a specific BS month
 */
export function getDaysInBsMonth(year: number, month: number): number {
    const monthDays = BS_CALENDAR_DATA[year]
    if (!monthDays) {
        throw new Error(`BS year ${year} is not supported. Supported range: ${BS_MIN_YEAR}-${BS_MAX_YEAR}`)
    }
    if (month < 1 || month > 12) {
        throw new Error(`Invalid month: ${month}. Must be between 1-12`)
    }
    return monthDays[month - 1]
}

/**
 * Check if a BS date is valid
 */
export function isValidBsDate(year: number, month: number, day: number): boolean {
    if (year < BS_MIN_YEAR || year > BS_MAX_YEAR) return false
    if (month < 1 || month > 12) return false

    try {
        const maxDays = getDaysInBsMonth(year, month)
        return day >= 1 && day <= maxDays
    } catch {
        return false
    }
}

/**
 * Get the day of week (0=Sunday, 6=Saturday) for the first day of a BS month
 */
export function getFirstDayOfBsMonth(year: number, month: number): number {
    // Convert first day of the month to AD and get weekday
    const adDate = bsToAd(year, month, 1)
    const date = new Date(adDate.year, adDate.month - 1, adDate.day)
    return date.getDay()
}

/**
 * Count total days from BS reference date to given BS date
 */
function countDaysFromBsReference(year: number, month: number, day: number): number {
    let totalDays = 0

    // Add days for complete years
    for (let y = BS_REFERENCE.year; y < year; y++) {
        totalDays += getTotalDaysInBsYear(y)
    }

    // Add days for complete months in the target year
    const monthDays = BS_CALENDAR_DATA[year]
    for (let m = 0; m < month - 1; m++) {
        totalDays += monthDays[m]
    }

    // Add remaining days (subtracting 1 because reference is day 1)
    totalDays += day - 1

    return totalDays
}

/**
 * Check if an AD year is a leap year
 */
function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get days in an AD month
 */
function getDaysInAdMonth(year: number, month: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (month === 2 && isLeapYear(year)) {
        return 29
    }
    return daysInMonth[month - 1]
}

/**
 * Convert BS date to AD date
 */
export function bsToAd(year: number, month: number, day: number): EnglishDate {
    if (!isValidBsDate(year, month, day)) {
        throw new Error(`Invalid BS date: ${year}-${month}-${day}`)
    }

    // Calculate days from BS reference
    const totalDays = countDaysFromBsReference(year, month, day)

    // Start from AD reference date and add days
    let adYear = AD_REFERENCE.year
    let adMonth = AD_REFERENCE.month
    let adDay = AD_REFERENCE.day

    let remainingDays = totalDays

    while (remainingDays > 0) {
        const daysInCurrentMonth = getDaysInAdMonth(adYear, adMonth)
        const daysLeftInMonth = daysInCurrentMonth - adDay

        if (remainingDays <= daysLeftInMonth) {
            adDay += remainingDays
            remainingDays = 0
        } else {
            remainingDays -= (daysLeftInMonth + 1)
            adMonth++
            adDay = 1

            if (adMonth > 12) {
                adMonth = 1
                adYear++
            }
        }
    }

    return { year: adYear, month: adMonth, day: adDay }
}

/**
 * Convert AD date to BS date
 */
export function adToBs(year: number, month: number, day: number): NepaliDate {
    // Validate AD date
    const adDate = new Date(year, month - 1, day)
    if (adDate.getFullYear() !== year || adDate.getMonth() !== month - 1 || adDate.getDate() !== day) {
        throw new Error(`Invalid AD date: ${year}-${month}-${day}`)
    }

    // Calculate days from AD reference using UTC to avoid timezone issues
    // (Nepal changed from +5:30 to +5:45 in 1986, causing inconsistent day calculations)
    const refDateUTC = Date.UTC(AD_REFERENCE.year, AD_REFERENCE.month - 1, AD_REFERENCE.day)
    const targetDateUTC = Date.UTC(year, month - 1, day)

    const diffTime = targetDateUTC - refDateUTC
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
        throw new Error(`Date ${year}-${month}-${day} is before the supported range`)
    }

    // Start from BS reference and add days
    let bsYear = BS_REFERENCE.year
    let bsMonth = BS_REFERENCE.month
    let bsDay = BS_REFERENCE.day

    let remainingDays = diffDays

    while (remainingDays > 0) {
        const daysInCurrentMonth = getDaysInBsMonth(bsYear, bsMonth)
        const daysLeftInMonth = daysInCurrentMonth - bsDay

        if (remainingDays <= daysLeftInMonth) {
            bsDay += remainingDays
            remainingDays = 0
        } else {
            remainingDays -= (daysLeftInMonth + 1)
            bsMonth++
            bsDay = 1

            if (bsMonth > 12) {
                bsMonth = 1
                bsYear++

                if (bsYear > BS_MAX_YEAR) {
                    throw new Error(`Date exceeds supported BS year range (max: ${BS_MAX_YEAR})`)
                }
            }
        }
    }

    return { year: bsYear, month: bsMonth, day: bsDay }
}

/**
 * Get today's date in BS
 */
export function getTodayBs(): NepaliDate {
    const today = new Date()
    return adToBs(today.getFullYear(), today.getMonth() + 1, today.getDate())
}

/**
 * Compare two BS dates
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareBsDates(a: NepaliDate, b: NepaliDate): number {
    if (a.year !== b.year) return a.year < b.year ? -1 : 1
    if (a.month !== b.month) return a.month < b.month ? -1 : 1
    if (a.day !== b.day) return a.day < b.day ? -1 : 1
    return 0
}

/**
 * Check if a BS date is within a range
 */
export function isBsDateInRange(
    date: NepaliDate,
    minDate?: NepaliDate,
    maxDate?: NepaliDate
): boolean {
    if (minDate && compareBsDates(date, minDate) < 0) return false
    if (maxDate && compareBsDates(date, maxDate) > 0) return false
    return true
}
