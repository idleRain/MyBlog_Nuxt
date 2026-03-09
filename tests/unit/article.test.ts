import { describe, it, expect } from 'vitest'
import { calculateReadingTime, generateExcerpt, generateSlug, extractHeadings } from '~/utils/article'

describe('calculateReadingTime', () => {
  it('should return 0 for empty content', () => {
    expect(calculateReadingTime('')).toBe(0)
    expect(calculateReadingTime(null as unknown as string)).toBe(0)
  })

  it('should calculate reading time for English content', () => {
    const content = 'This is a test content with multiple words to calculate reading time.'
    const result = calculateReadingTime(content, 200)
    expect(result).toBeGreaterThan(0)
  })

  it('should calculate reading time for Chinese content', () => {
    const content = '这是一段中文内容，用于测试阅读时间计算功能。'
    const result = calculateReadingTime(content, 200)
    expect(result).toBeGreaterThan(0)
  })

  it('should handle HTML content', () => {
    const content = '<p>This is <strong>HTML</strong> content.</p>'
    const result = calculateReadingTime(content, 200)
    expect(result).toBeGreaterThanOrEqual(1)
  })
})

describe('generateExcerpt', () => {
  it('should return empty string for empty content', () => {
    expect(generateExcerpt('')).toBe('')
  })

  it('should return content if shorter than length', () => {
    const content = 'Short content'
    expect(generateExcerpt(content, 100)).toBe(content)
  })

  it('should truncate long content', () => {
    const content = 'This is a very long content that should be truncated to fit the specified length limit.'
    const result = generateExcerpt(content, 20)
    expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
    expect(result.endsWith('...')).toBe(true)
  })

  it('should remove HTML tags', () => {
    const content = '<p>This is <strong>HTML</strong> content.</p>'
    const result = generateExcerpt(content)
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
  })
})

describe('generateSlug', () => {
  it('should convert to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('hello world test')).toBe('hello-world-test')
  })

  it('should remove special characters', () => {
    expect(generateSlug('Hello! World@#$%')).toBe('hello-world')
  })

  it('should handle multiple hyphens', () => {
    expect(generateSlug('hello--world')).toBe('hello-world')
  })
})

describe('extractHeadings', () => {
  it('should extract headings from HTML', () => {
    const html = `
      <h2 id="intro">Introduction</h2>
      <h3 id="setup">Setup</h3>
      <h4 id="config">Configuration</h4>
    `
    const result = extractHeadings(html)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ id: 'intro', text: 'Introduction', level: 2 })
    expect(result[1]).toEqual({ id: 'setup', text: 'Setup', level: 3 })
    expect(result[2]).toEqual({ id: 'config', text: 'Configuration', level: 4 })
  })

  it('should filter by levels', () => {
    const html = `
      <h2 id="intro">Introduction</h2>
      <h3 id="setup">Setup</h3>
      <h4 id="config">Configuration</h4>
    `
    const result = extractHeadings(html, [2, 3])
    expect(result).toHaveLength(2)
    expect(result.find((h) => h.level === 4)).toBeUndefined()
  })

  it('should return empty array for no headings', () => {
    expect(extractHeadings('<p>No headings here</p>')).toEqual([])
  })
})
