/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content) return 0

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '')

  // Count words (Chinese characters + English words)
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length

  // Chinese characters count as 1.5 words
  const totalWords = chineseChars * 1.5 + englishWords

  return Math.ceil(totalWords / wordsPerMinute)
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, length = 160): string {
  if (!content) return ''

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '')

  // Trim and truncate
  const trimmed = text.trim().replace(/\s+/g, ' ')

  if (trimmed.length <= length) return trimmed

  return trimmed.slice(0, length).trim() + '...'
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Parse HTML content to extract headings
 */
export function extractHeadings(
  html: string,
  levels: number[] = [2, 3, 4]
): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = []
  const levelPattern = levels.join('|')
  const regex = new RegExp(`<h(${levelPattern})[^>]*id="([^"]+)"[^>]*>(.*?)</h\\1>`, 'g')

  let match
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }

  return headings
}
