import { z } from 'zod'
import { comparePassword } from '~/server/utils/password'
import { successResponse, errorResponse } from '~/server/utils/response'
import { useJWT } from '~/server/utils/jwt'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = loginSchema.parse(body)

    const pool = useMySQL()

    // Find user by email
    const [users] = await pool.execute(
      'SELECT id, username, email, password, nickname, avatar, bio, role, created_at, updated_at FROM users WHERE email = ?',
      [validatedData.email]
    )

    if (!Array.isArray(users) || users.length === 0) {
      return errorResponse('邮箱或密码错误')
    }

    const user = users[0] as {
      id: number
      username: string
      email: string
      password: string
      nickname: string | null
      avatar: string | null
      bio: string | null
      role: string
      created_at: Date
      updated_at: Date
    }

    // Verify password
    const isValidPassword = await comparePassword(validatedData.password, user.password)
    if (!isValidPassword) {
      return errorResponse('邮箱或密码错误')
    }

    // Generate token
    const { generateToken } = useJWT()
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return successResponse({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname || user.username,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
      },
      token,
    }, '登录成功')
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof z.ZodError) {
      return errorResponse('输入数据格式错误')
    }
    return errorResponse('登录失败，请稍后重试')
  }
})
