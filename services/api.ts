import type {
  Article,
  ArticleListItem,
  ArticlePayload,
  ArticlesQueryParams,
  PaginatedResponse,
  Category,
  Tag,
  Comment,
  CommentPayload,
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  DashboardStats,
  RecentActivity,
  ArchiveItem,
} from '~/types'

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseURL?: string
  timeout?: number
}

/**
 * API error class
 */
export class ApiError extends Error {
  statusCode: number
  errors?: Record<string, string[]>

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

/**
 * Create API client
 */
export function createApiClient(config: ApiClientConfig = {}) {
  const { baseURL = '/api', timeout = 30000 } = config

  /**
   * Make HTTP request
   */
  async function request<T>(
    path: string,
    options: RequestInit & { query?: Record<string, unknown> } = {}
  ): Promise<T> {
    const { query, ...init } = options

    // Build URL with query params
    let url = `${baseURL}${path}`
    if (query) {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    // Add default headers
    const headers = new Headers(init.headers)
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json')
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.message || 'An error occurred',
          data.errors
        )
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout')
        }
        throw new ApiError(0, error.message)
      }

      throw new ApiError(0, 'Unknown error')
    }
  }

  return {
    get: <T>(path: string, query?: Record<string, unknown>) =>
      request<T>(path, { method: 'GET', query }),

    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

    put: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

    delete: <T>(path: string) =>
      request<T>(path, { method: 'DELETE' }),
  }
}

/**
 * API client instance
 */
const api = createApiClient()

/**
 * Articles API
 */
export const articlesApi = {
  /**
   * Get articles list
   */
  getList: (params: ArticlesQueryParams = {}) =>
    api.get<PaginatedResponse<ArticleListItem>>('/articles', params as Record<string, unknown>),

  /**
   * Get article by ID
   */
  getById: (id: number) =>
    api.get<Article>(`/articles/${id}`),

  /**
   * Get article by slug
   */
  getBySlug: (slug: string) =>
    api.get<Article>(`/articles/slug/${slug}`),

  /**
   * Create article
   */
  create: (data: ArticlePayload) =>
    api.post<Article>('/articles', data),

  /**
   * Update article
   */
  update: (id: number, data: Partial<ArticlePayload>) =>
    api.put<Article>(`/articles/${id}`, data),

  /**
   * Delete article
   */
  delete: (id: number) =>
    api.delete<void>(`/articles/${id}`),

  /**
   * Like article
   */
  like: (id: number) =>
    api.post<{ likeCount: number }>(`/articles/${id}/like`),

  /**
   * Get related articles
   */
  getRelated: (id: number, limit = 4) =>
    api.get<ArticleListItem[]>(`/articles/${id}/related`, { limit }),
}

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: () =>
    api.get<Category[]>('/categories'),

  /**
   * Get category by slug
   */
  getBySlug: (slug: string) =>
    api.get<Category>(`/categories/${slug}`),

  /**
   * Create category
   */
  create: (data: { name: string; slug: string; description?: string }) =>
    api.post<Category>('/categories', data),

  /**
   * Update category
   */
  update: (id: number, data: Partial<{ name: string; slug: string; description?: string }>) =>
    api.put<Category>(`/categories/${id}`, data),

  /**
   * Delete category
   */
  delete: (id: number) =>
    api.delete<void>(`/categories/${id}`),
}

/**
 * Tags API
 */
export const tagsApi = {
  /**
   * Get all tags
   */
  getAll: () =>
    api.get<Tag[]>('/tags'),

  /**
   * Get tag by slug
   */
  getBySlug: (slug: string) =>
    api.get<Tag>(`/tags/${slug}`),

  /**
   * Create tag
   */
  create: (data: { name: string; slug: string }) =>
    api.post<Tag>('/tags', data),

  /**
   * Delete tag
   */
  delete: (id: number) =>
    api.delete<void>(`/tags/${id}`),
}

/**
 * Comments API
 */
export const commentsApi = {
  /**
   * Get comments by article ID
   */
  getByArticleId: (articleId: number, params?: { page?: number; pageSize?: number }) =>
    api.get<PaginatedResponse<Comment>>(`/articles/${articleId}/comments`, params as Record<string, unknown>),

  /**
   * Create comment
   */
  create: (data: CommentPayload) =>
    api.post<Comment>('/comments', data),

  /**
   * Like comment
   */
  like: (id: number) =>
    api.post<{ likes: number }>(`/comments/${id}/like`),

  /**
   * Delete comment
   */
  delete: (id: number) =>
    api.delete<void>(`/comments/${id}`),
}

/**
 * Auth API
 */
export const authApi = {
  /**
   * Login
   */
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data),

  /**
   * Register
   */
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data),

  /**
   * Logout
   */
  logout: () =>
    api.post<void>('/auth/logout'),

  /**
   * Get current user
   */
  getMe: () =>
    api.get<User>('/auth/me'),

  /**
   * Update profile
   */
  updateProfile: (data: Partial<{ nickname: string; avatar: string; bio: string }>) =>
    api.put<User>('/auth/profile', data),

  /**
   * Change password
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<void>('/auth/change-password', data),
}

/**
 * Admin API
 */
export const adminApi = {
  /**
   * Get dashboard stats
   */
  getStats: () =>
    api.get<DashboardStats>('/admin/stats'),

  /**
   * Get recent activity
   */
  getRecentActivity: () =>
    api.get<RecentActivity>('/admin/recent-activity'),

  /**
   * Get archives
   */
  getArchives: () =>
    api.get<ArchiveItem[]>('/admin/archives'),

  /**
   * Get all users
   */
  getUsers: (params?: { page?: number; pageSize?: number; role?: string; keyword?: string }) =>
    api.get<PaginatedResponse<User>>('/admin/users', params as Record<string, unknown>),

  /**
   * Update user role
   */
  updateUserRole: (id: number, role: string) =>
    api.put<User>(`/admin/users/${id}/role`, { role }),

  /**
   * Delete user
   */
  deleteUser: (id: number) =>
    api.delete<void>(`/admin/users/${id}`),

  /**
   * Moderate comment
   */
  moderateComment: (id: number, status: 'approved' | 'rejected' | 'spam') =>
    api.put<Comment>(`/admin/comments/${id}/status`, { status }),
}

/**
 * Upload API
 */
export const uploadApi = {
  /**
   * Upload file
   */
  upload: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      throw new ApiError(response.status, data.message || 'Upload failed')
    }

    return response.json()
  },
}

export default api
