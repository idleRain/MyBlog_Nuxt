import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  articleCreateSchema,
  commentCreateSchema,
  paginationSchema,
} from '~/schemas'

describe('loginSchema', () => {
  it('should validate valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('should validate valid register data', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject mismatched passwords', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid username characters', () => {
    const result = registerSchema.safeParse({
      username: 'test user!',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short username', () => {
    const result = registerSchema.safeParse({
      username: 'ab',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })
})

describe('articleCreateSchema', () => {
  it('should validate valid article data', () => {
    const result = articleCreateSchema.safeParse({
      title: 'Test Article',
      summary: 'This is a test article summary.',
      content: 'This is the article content.',
      categoryId: 1,
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty title', () => {
    const result = articleCreateSchema.safeParse({
      title: '',
      summary: 'Summary',
      content: 'Content',
      categoryId: 1,
    })
    expect(result.success).toBe(false)
  })

  it('should reject title over 200 characters', () => {
    const result = articleCreateSchema.safeParse({
      title: 'a'.repeat(201),
      summary: 'Summary',
      content: 'Content',
      categoryId: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('commentCreateSchema', () => {
  it('should validate valid comment data', () => {
    const result = commentCreateSchema.safeParse({
      content: 'This is a comment.',
      articleId: 1,
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty content', () => {
    const result = commentCreateSchema.safeParse({
      content: '',
      articleId: 1,
    })
    expect(result.success).toBe(false)
  })

  it('should reject content over 2000 characters', () => {
    const result = commentCreateSchema.safeParse({
      content: 'a'.repeat(2001),
      articleId: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('paginationSchema', () => {
  it('should use default values', () => {
    const result = paginationSchema.parse({})
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })

  it('should coerce string numbers', () => {
    const result = paginationSchema.parse({
      page: '2',
      pageSize: '20',
    })
    expect(result.page).toBe(2)
    expect(result.pageSize).toBe(20)
  })

  it('should reject pageSize over 100', () => {
    const result = paginationSchema.safeParse({
      pageSize: 101,
    })
    expect(result.success).toBe(false)
  })
})
