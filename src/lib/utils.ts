import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date with Portuguese locale
 */
export const formatDate = (date: Date | string, formatStr: string = "PPP"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, formatStr, { locale: pt })
}

/**
 * Format date with Portuguese locale (for ISO strings)
 */
export const formatDateFromISO = (dateString: string, formatStr: string = "PPP"): string => {
  return formatDate(new Date(dateString), formatStr)
}

/**
 * Format number with Portuguese decimal separator (comma instead of period)
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals).replace('.', ',')
}
