import { z } from 'zod'
import { hashPassword } from '~/server/utils/password'
import { successResponse, errorResponse } from '~/server/utils/response'
import { useJWT } from '~/server/utils/jwt'

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  nickname: z.string().max(50).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = registerSchema.parse(body)

    const pool = useMySQL()

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [validatedData.email, validatedData.username]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return errorResponse('用户名或邮箱已存在')
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Insert user
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password, nickname, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'user', NOW(), NOW())`,
      [validatedData.username, validatedData.email, hashedPassword, validatedData.nickname || validatedData.username]
    )

    const insertResult = result as { insertId: number }
    const userId = insertResult.insertId

    // Generate token
    const { generateToken } = useJWT()
    const token = generateToken({
      id: userId,
      email: validatedData.email,
      role: 'user',
    })

    return successResponse({
      user: {
        id: userId,
        username: validatedData.username,
        email: validatedData.email,
        nickname: validatedData.nickname || validatedData.username,
        role: 'user',
      },
      token,
    }, '注册成功')
  } catch (error) {
    console.error('Register error:', error)
    if (error instanceof z.ZodError) {
      return errorResponse('输入数据格式错误')
    }
    return errorResponse('注册失败，请稍后重试')
  }
})
