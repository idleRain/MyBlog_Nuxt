import { defineStore } from 'pinia'
import type { Category, Tag } from '~/types'
import { categoriesApi, tagsApi, ApiError } from '~/services/api'

interface MetaState {
  categories: Category[]
  tags: Tag[]
  isLoading: boolean
  error: string | null
}

export const useMetaStore = defineStore('meta', {
  state: (): MetaState => ({
    categories: [],
    tags: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    hasCategories: (state) => state.categories.length > 0,
    hasTags: (state) => state.tags.length > 0,
    getCategoryBySlug: (state) => (slug: string) =>
      state.categories.find((c) => c.slug === slug),
    getTagBySlug: (state) => (slug: string) =>
      state.tags.find((t) => t.slug === slug),
  },

  actions: {
    /**
     * Fetch all categories
     */
    async fetchCategories() {
      if (this.categories.length > 0) return // Already loaded

      this.isLoading = true
      this.error = null

      try {
        this.categories = await categoriesApi.getAll()
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch all tags
     */
    async fetchTags() {
      if (this.tags.length > 0) return // Already loaded

      this.isLoading = true
      this.error = null

      try {
        this.tags = await tagsApi.getAll()
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch all meta data
     */
    async fetchAll() {
      await Promise.all([this.fetchCategories(), this.fetchTags()])
    },

    /**
     * Create category
     */
    async createCategory(data: Parameters<typeof categoriesApi.create>[0]) {
      this.isLoading = true
      this.error = null

      try {
        const category = await categoriesApi.create(data)
        this.categories.push(category)
        return category
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create tag
     */
    async createTag(data: Parameters<typeof tagsApi.create>[0]) {
      this.isLoading = true
      this.error = null

      try {
        const tag = await tagsApi.create(data)
        this.tags.push(tag)
        return tag
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete category
     */
    async deleteCategory(id: number) {
      try {
        await categoriesApi.delete(id)
        this.categories = this.categories.filter((c) => c.id !== id)
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return false
      }
    },

    /**
     * Delete tag
     */
    async deleteTag(id: number) {
      try {
        await tagsApi.delete(id)
        this.tags = this.tags.filter((t) => t.id !== id)
        return true
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        }
        return false
      }
    },

    /**
     * Reset store
     */
    reset() {
      this.categories = []
      this.tags = []
      this.error = null
    },
  },
})
