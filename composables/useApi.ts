import type { ApiResponse, PaginatedResponse } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  
  const request = async <T>(
    endpoint: string,
    options: RequestInit & { body?: unknown } = {}
  ): Promise<ApiResponse<T>> => {
    const url = `${config.public.apiBase}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth token if available
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    return response.json()
  }

  const post = <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body })

  const get = <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' })

  return {
    request,
    post,
    get,
  }
}

export const useAuth = () => {
  const user = useState('user', () => null as User | null)
  const token = useState('token', () => '')
  const isLoggedIn = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    const api = useApi()
    const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password })
    
    if (response.code === 0) {
      user.value = response.data.user
      token.value = response.data.token
      
      if (import.meta.client) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }
    
    return response
  }

  const register = async (username: string, email: string, password: string) => {
    const api = useApi()
    const response = await api.post<{ user: User; token: string }>('/auth/register', {
      username,
      email,
      password,
    })
    
    if (response.code === 0) {
      user.value = response.data.user
      token.value = response.data.token
      
      if (import.meta.client) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }
    
    return response
  }

  const logout = () => {
    user.value = null
    token.value = ''
    
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return null
    
    const api = useApi()
    const response = await api.post<User>('/auth/me')
    
    if (response.code === 0) {
      user.value = response.data
      return response.data
    }
    
    return null
  }

  // Initialize from localStorage
  if (import.meta.client) {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchUser,
  }
}

interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar?: string
  bio?: string
  role: string
}
