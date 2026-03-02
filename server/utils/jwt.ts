import jwt from 'jsonwebtoken'
import type { User } from '~/types'

interface JwtPayload {
  userId: number
  email: string
  role: string
}

export function useJWT() {
  const config = useRuntimeConfig()

  function generateToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, config.jwtSecret as string, {
      expiresIn: config.jwtExpiresIn as string,
    })
  }

  function verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret as string) as JwtPayload
    } catch {
      return null
    }
  }

  function decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload
    } catch {
      return null
    }
  }

  return {
    generateToken,
    verifyToken,
    decodeToken,
  }
}
