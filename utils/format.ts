/**
 * Format a date string to a localized format
 */
export function formatDate(
  dateStr: string | Date,
  locale = 'zh-CN',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!dateStr) return ''
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return date.toLocaleDateString(locale, options)
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string | Date, locale = 'zh-CN'): string {
  if (!dateStr) return ''
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute')
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour')
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day')
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month')
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return rtf.format(-diffInYears, 'year')
}

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(num: number, locale = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format a number as compact (e.g., 1.2K, 1.5M)
 */
export function formatCompactNumber(num: number, locale = 'zh-CN'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}
