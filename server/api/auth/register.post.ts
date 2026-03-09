import type { AuthResponse } from '~/types'
import { registerSchema } from '~/schemas'

// Mock user storage (in real app, use database)
const mockUsers: Array<{ id: number; username: string; email: string; password: string; role: string }> = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
]

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody(event)

  // Validate input
  const result = registerSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      errors: result.error.flatten().fieldErrors,
    })
  }

  const { username, email, password } = result.data

  // Check if email already exists
  if (mockUsers.some((u) => u.email === email)) {
    throw createError({
      statusCode: 409,
      message: 'Email already registered',
    })
  }

  // Check if username already exists
  if (mockUsers.some((u) => u.username === username)) {
    throw createError({
      statusCode: 409,
      message: 'Username already taken',
    })
  }

  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    username,
    email,
    password, // In real app, hash the password
    role: 'user',
  }

  mockUsers.push(newUser)

  // Generate token
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`

  return {
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      nickname: newUser.username,
      avatar: `https://picsum.photos/seed/${newUser.username}/100/100`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token,
    expiresIn: 7 * 24 * 60 * 60,
  }
})
