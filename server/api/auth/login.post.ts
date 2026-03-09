import type { AuthResponse, User } from '~/types'
import { loginSchema } from '~/schemas'

// Mock user data
const mockUsers: Array<{ id: number; username: string; email: string; password: string; role: string; nickname: string; avatar: string }> = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // In real app, this should be hashed
    role: 'admin',
    nickname: '管理员',
    avatar: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'editor',
    nickname: '编辑',
    avatar: 'https://picsum.photos/seed/editor/100/100',
  },
]

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody(event)

  // Validate input
  const result = loginSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      errors: result.error.flatten().fieldErrors,
    })
  }

  const { email, password } = result.data

  // Find user
  const user = mockUsers.find((u) => u.email === email)

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  // Generate token (in real app, use JWT)
  const token = `mock-jwt-token-${user.id}-${Date.now()}`

  // Return response
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role as 'admin' | 'editor' | 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  }
})
