import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~/types'
import { authApi, ApiError } from '~/services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => state.user?.role === 'editor' || state.user?.role === 'admin',
    userDisplayName: (state) => state.user?.nickname || state.user?.username || '',
  },

  actions: {
    /**
     * Initialize auth state from localStorage
     */
    init() {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        this.fetchUser()
      }
    },

    /**
     * Set auth data
     */
    setAuth(data: AuthResponse) {
      this.user = data.user
      this.token = data.token
      this.isAuthenticated = true
      this.error = null

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token)
      }
    },

    /**
     * Clear auth data
     */
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    },

    /**
     * Fetch current user
     */
    async fetchUser() {
      if (!this.token) return

      this.isLoading = true
      this.error = null

      try {
        const user = await authApi.getMe()
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        this.clearAuth()
        if (error instanceof ApiError) {
          this.error = error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Login
     */
    async login(email: string, password: string, rememberMe = false) {
      this.isLoading = true
      this.error = null

      try {
        const data = await authApi.login({ email, password, rememberMe })
        this.setAuth(data)
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        } else {
          this.error = 'Login failed'
        }
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Register
     */
    async register(username: string, email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const data = await authApi.register({ username, email, password, confirmPassword: password })
        this.setAuth(data)
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        } else {
          this.error = 'Registration failed'
        }
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        await authApi.logout()
      } catch {
        // Ignore logout errors
      } finally {
        this.clearAuth()
      }
    },

    /**
     * Update profile
     */
    async updateProfile(data: Partial<{ nickname: string; avatar: string; bio: string }>) {
      if (!this.user) return false

      this.isLoading = true
      this.error = null

      try {
        const user = await authApi.updateProfile(data)
        this.user = user
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Change password
     */
    async changePassword(currentPassword: string, newPassword: string) {
      this.isLoading = true
      this.error = null

      try {
        await authApi.changePassword({ currentPassword, newPassword })
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return false
      } finally {
        this.isLoading = false
      }
    },
  },
})
