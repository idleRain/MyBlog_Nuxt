// User types
export interface User {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  bio?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'editor' | 'user'

// Article types
export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  cover?: string
  authorId: number
  author?: User
  categoryId: number
  category?: Category
  tags: Tag[]
  status: ArticleStatus
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export type ArticleStatus = 'draft' | 'published' | 'archived'

// Category types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  parent?: Category
  children?: Category[]
  articleCount: number
  createdAt: string
  updatedAt: string
}

// Tag types
export interface Tag {
  id: number
  name: string
  slug: string
  articleCount: number
  createdAt: string
}

// Comment types
export interface Comment {
  id: number
  content: string
  articleId: number
  article?: Article
  userId: number
  user?: User
  parentId?: number
  parent?: Comment
  replies?: Comment[]
  status: CommentStatus
  createdAt: string
  updatedAt: string
}

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

// API Response types
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// File types
export interface FileInfo {
  id: number
  name: string
  originalName: string
  mimeType: string
  size: number
  url: string
  path: string
  uploaderId: number
  createdAt: string
}
