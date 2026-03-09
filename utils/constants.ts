/**
 * Site configuration constants
 */
export const SITE_CONFIG = {
  name: 'My Blog',
  description: '一个使用 Nuxt 3 构建的现代化全栈个人博客应用',
  url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'idleRain',
  email: 'gold.experience@foxmail.com',
} as const

/**
 * Navigation items
 */
export const NAV_ITEMS = [
  { path: '/', label: 'nav.home' },
  { path: '/articles', label: 'nav.articles' },
  { path: '/archives', label: 'nav.archives' },
  { path: '/about', label: 'nav.about' },
] as const

/**
 * Social links
 */
export const SOCIAL_LINKS = [
  { name: 'GitHub', icon: 'lucide:github', url: 'https://github.com/idleRain' },
  { name: 'Twitter', icon: 'lucide:twitter', url: 'https://twitter.com' },
  { name: 'RSS', icon: 'lucide:rss', url: '/rss.xml' },
] as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const

/**
 * Article status
 */
export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

/**
 * Comment status
 */
export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SPAM: 'spam',
} as const

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
} as const

/**
 * Z-index scale
 */
export const Z_INDEX = {
  DROPDOWN: 50,
  STICKY: 100,
  FIXED: 150,
  MODAL_BACKDROP: 200,
  MODAL: 210,
  POPOVER: 220,
  TOOLTIP: 230,
  TOAST: 240,
} as const
