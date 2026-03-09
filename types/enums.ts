/**
 * Article status enum
 */
export type ArticleStatus = 'draft' | 'published' | 'archived'

/**
 * Comment status enum
 */
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

/**
 * User role enum
 */
export type UserRole = 'admin' | 'editor' | 'user'

/**
 * Article status values
 */
export const ARTICLE_STATUS_VALUES: ArticleStatus[] = ['draft', 'published', 'archived']

/**
 * Comment status values
 */
export const COMMENT_STATUS_VALUES: CommentStatus[] = ['pending', 'approved', 'rejected', 'spam']

/**
 * User role values
 */
export const USER_ROLE_VALUES: UserRole[] = ['admin', 'editor', 'user']

/**
 * Check if article status is valid
 */
export function isValidArticleStatus(status: string): status is ArticleStatus {
  return ARTICLE_STATUS_VALUES.includes(status as ArticleStatus)
}

/**
 * Check if comment status is valid
 */
export function isValidCommentStatus(status: string): status is CommentStatus {
  return COMMENT_STATUS_VALUES.includes(status as CommentStatus)
}

/**
 * Check if user role is valid
 */
export function isValidUserRole(role: string): role is UserRole {
  return USER_ROLE_VALUES.includes(role as UserRole)
}
