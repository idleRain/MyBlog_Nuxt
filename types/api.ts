import type { ArticleListItem, Article, Category, Tag, Comment, User } from './entities'

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * API error response
 */
export interface ApiError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

/**
 * Articles query params
 */
export interface ArticlesQueryParams extends PaginationParams {
  status?: string
  category?: string
  tag?: string
  keyword?: string
  sortBy?: 'publishedAt' | 'viewCount' | 'likeCount'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Article create/update payload
 */
export interface ArticlePayload {
  title: string
  summary: string
  content: string
  cover?: string
  status?: 'draft' | 'published'
  categoryId: number
  tagIds?: number[]
}

/**
 * Comment create payload
 */
export interface CommentPayload {
  content: string
  articleId: number
  parentId?: number
}

/**
 * Login payload
 */
export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Register payload
 */
export interface RegisterPayload {
  username: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

/**
 * Dashboard stats
 */
export interface DashboardStats {
  articleCount: number
  viewCount: number
  commentCount: number
  userCount: number
  articleGrowth: number
  viewGrowth: number
  commentGrowth: number
  userGrowth: number
}

/**
 * Recent activity
 */
export interface RecentActivity {
  articles: ArticleListItem[]
  comments: Pick<Comment, 'id' | 'content' | 'author' | 'createdAt' | 'article'>[]
}

/**
 * Archive item
 */
export interface ArchiveItem {
  year: number
  month: number
  count: number
  articles: ArticleListItem[]
}
