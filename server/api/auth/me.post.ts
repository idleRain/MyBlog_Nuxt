import { successResponse, errorResponse } from '~/server/utils/response'
import { useJWT } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Get token from header
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('未授权访问', 401)
    }

    const token = authHeader.substring(7)
    const { verifyToken } = useJWT()
    const payload = verifyToken(token)

    if (!payload) {
      return errorResponse('Token 无效或已过期', 401)
    }

    const pool = useMySQL()

    // Get user info
    const [users] = await pool.execute(
      'SELECT id, username, email, nickname, avatar, bio, role, created_at, updated_at FROM users WHERE id = ?',
      [payload.userId]
    )

    if (!Array.isArray(users) || users.length === 0) {
      return errorResponse('用户不存在', 401)
    }

    const user = users[0] as {
      id: number
      username: string
      email: string
      nickname: string | null
      avatar: string | null
      bio: string | null
      role: string
      created_at: Date
      updated_at: Date
    }

    return successResponse({
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname || user.username,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    })
  } catch (error) {
    console.error('Get user info error:', error)
    return errorResponse('获取用户信息失败', 500)
  }
})
