import { z } from 'zod'

/**
 * Article status schema
 */
export const articleStatusSchema = z.enum(['draft', 'published', 'archived'])

/**
 * Comment status schema
 */
export const commentStatusSchema = z.enum(['pending', 'approved', 'rejected', 'spam'])

/**
 * User role schema
 */
export const userRoleSchema = z.enum(['admin', 'editor', 'user'])

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})

/**
 * Articles query schema
 */
export const articlesQuerySchema = paginationSchema.extend({
  status: articleStatusSchema.optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  keyword: z.string().trim().max(100).optional(),
  sortBy: z.enum(['publishedAt', 'viewCount', 'likeCount']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Article create schema
 */
export const articleCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  summary: z.string().trim().min(1, 'Summary is required').max(500, 'Summary must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  cover: z.string().url('Cover must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryId: z.number().int().positive('Category is required'),
  tagIds: z.array(z.number().int().positive()).optional(),
})

/**
 * Article update schema
 */
export const articleUpdateSchema = articleCreateSchema.partial()

/**
 * Comment create schema
 */
export const commentCreateSchema = z.object({
  content: z.string().trim().min(1, 'Comment is required').max(2000, 'Comment must be less than 2000 characters'),
  articleId: z.number().int().positive('Article ID is required'),
  parentId: z.number().int().positive().optional(),
})

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

/**
 * Register schema
 */
export const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

/**
 * User update schema
 */
export const userUpdateSchema = z.object({
  nickname: z.string().trim().max(50).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().trim().max(500).optional(),
})

/**
 * Category create schema
 */
export const categoryCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string().trim().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: z.string().trim().max(200).optional(),
})

/**
 * Tag create schema
 */
export const tagCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(30, 'Name must be less than 30 characters'),
  slug: z.string().trim().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
})

/**
 * Settings update schema
 */
export const settingsUpdateSchema = z.object({
  siteName: z.string().trim().max(100).optional(),
  siteDescription: z.string().trim().max(500).optional(),
  siteUrl: z.string().url().optional(),
  seoKeywords: z.string().trim().max(500).optional(),
  seoDescription: z.string().trim().max(500).optional(),
})

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document', 'video']).optional(),
}).refine((data) => data.file.size <= 10 * 1024 * 1024, {
  message: 'File size must be less than 10MB',
}).refine((data) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  return allowedTypes.includes(data.file.type)
}, {
  message: 'Invalid file type',
})

/**
 * Type exports
 */
export type ArticlesQueryInput = z.infer<typeof articlesQuerySchema>
export type ArticleCreateInput = z.infer<typeof articleCreateSchema>
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>
export type CommentCreateInput = z.infer<typeof commentCreateSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>
