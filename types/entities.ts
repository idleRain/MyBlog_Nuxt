import type { ArticleStatus, CommentStatus, UserRole } from './enums'

/**
 * User entity
 */
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

/**
 * Category entity
 */
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  articleCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Tag entity
 */
export interface Tag {
  id: number
  name: string
  slug: string
  articleCount: number
  createdAt: string
}

/**
 * Article entity
 */
export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  cover?: string
  status: ArticleStatus
  viewCount: number
  likeCount: number
  commentCount: number
  readingTime: number
  author: Pick<User, 'id' | 'username' | 'nickname' | 'avatar'>
  category: Pick<Category, 'id' | 'name' | 'slug'>
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Comment entity
 */
export interface Comment {
  id: number
  content: string
  status: CommentStatus
  likes: number
  author: Pick<User, 'id' | 'username' | 'nickname' | 'avatar'>
  article: Pick<Article, 'id' | 'title'>
  parentId?: number
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

/**
 * Article list item (lighter version)
 */
export interface ArticleListItem {
  id: number
  title: string
  slug: string
  summary: string
  cover?: string
  status: ArticleStatus
  viewCount: number
  likeCount: number
  commentCount: number
  readingTime: number
  category: Pick<Category, 'id' | 'name' | 'slug'>
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[]
  publishedAt?: string
  createdAt: string
}
