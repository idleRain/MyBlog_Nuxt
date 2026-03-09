import { z } from 'zod'

/**
 * Environment variables schema
 */
const envSchema = z.object({
  // Database
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),

  // MongoDB
  MONGODB_URI: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Upload
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(10485760),

  // Public
  NUXT_PUBLIC_API_BASE: z.string().default('/api'),
  NUXT_PUBLIC_SITE_URL: z.string().url('NUXT_PUBLIC_SITE_URL must be a valid URL'),
})

/**
 * Validate environment variables
 */
export function validateEnv(env: Record<string, string | undefined>) {
  // Skip validation in development if using defaults
  if (process.env.NODE_ENV === 'development') {
    return {
      success: true,
      data: {
        DB_HOST: env.DB_HOST || 'localhost',
        DB_PORT: env.DB_PORT ? parseInt(env.DB_PORT) : 3306,
        DB_USER: env.DB_USER || 'root',
        DB_PASSWORD: env.DB_PASSWORD || '',
        DB_NAME: env.DB_NAME || 'blog',
        MONGODB_URI: env.MONGODB_URI,
        JWT_SECRET: env.JWT_SECRET || 'dev-secret-key-do-not-use-in-production',
        JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || '7d',
        UPLOAD_DIR: env.UPLOAD_DIR || './uploads',
        MAX_FILE_SIZE: env.MAX_FILE_SIZE ? parseInt(env.MAX_FILE_SIZE) : 10485760,
        NUXT_PUBLIC_API_BASE: env.NUXT_PUBLIC_API_BASE || '/api',
        NUXT_PUBLIC_SITE_URL: env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    }
  }

  // Strict validation in production
  const result = envSchema.safeParse(env)

  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    })

    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }

  return result
}

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>
