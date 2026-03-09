import type { User } from '~/types'

// Mock user data
const mockUser: User = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  nickname: '管理员',
  avatar: 'https://picsum.photos/seed/admin/100/100',
  bio: '全栈开发工程师，热爱开源和技术分享。',
  role: 'admin',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
}

export default defineEventHandler(async (event): Promise<User> => {
  // Get token from header
  const authHeader = getHeader(event, 'Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const token = authHeader.substring(7)

  // Validate token (in real app, verify JWT)
  if (!token.startsWith('mock-jwt-token-')) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token',
    })
  }

  // Return current user
  return mockUser
})
