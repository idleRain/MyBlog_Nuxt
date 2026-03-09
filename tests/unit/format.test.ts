import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeTime, formatNumber, formatCompactNumber } from '~/utils/format'

describe('formatDate', () => {
  it('should format a date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('2024年1月15日')
  })

  it('should format a Date object correctly', () => {
    const result = formatDate(new Date('2024-01-15'))
    expect(result).toBe('2024年1月15日')
  })

  it('should return empty string for null/undefined', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(null as unknown as string)).toBe('')
  })

  it('should respect locale option', () => {
    const result = formatDate('2024-01-15', 'en-US')
    expect(result).toBe('January 15, 2024')
  })
})

describe('formatRelativeTime', () => {
  it('should return "just now" for recent times', () => {
    const now = new Date()
    const result = formatRelativeTime(now.toISOString())
    expect(result).toContain('刚刚')
  })

  it('should return minutes ago for times within an hour', () => {
    const date = new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    const result = formatRelativeTime(date.toISOString())
    expect(result).toContain('分钟')
  })

  it('should return hours ago for times within a day', () => {
    const date = new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    const result = formatRelativeTime(date.toISOString())
    expect(result).toContain('小时')
  })

  it('should return days ago for times within a month', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    const result = formatRelativeTime(date.toISOString())
    expect(result).toContain('天')
  })
})

describe('formatNumber', () => {
  it('should format numbers with locale', () => {
    expect(formatNumber(1234)).toBe('1,234')
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

describe('formatCompactNumber', () => {
  it('should format large numbers compactly', () => {
    expect(formatCompactNumber(1200)).toBe('1200')
    expect(formatCompactNumber(1500000)).toBe('150万')
  })
})
