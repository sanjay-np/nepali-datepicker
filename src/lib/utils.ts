import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes safely using clsx and tailwind-merge.
 *
 * @param inputs - Array of class names or conditional class objects
 * @returns Optimized class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
