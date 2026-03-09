import { defineStore } from 'pinia'
import type { Article, ArticleListItem, ArticlesQueryParams, PaginatedResponse } from '~/types'
import { articlesApi, ApiError } from '~/services/api'

interface ArticlesState {
  articles: ArticleListItem[]
  currentArticle: Article | null
  relatedArticles: ArticleListItem[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  isLoading: boolean
  error: string | null
}

export const useArticlesStore = defineStore('articles', {
  state: (): ArticlesState => ({
    articles: [],
    currentArticle: null,
    relatedArticles: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    hasArticles: (state) => state.articles.length > 0,
    hasMore: (state) => state.pagination.hasNext,
  },

  actions: {
    /**
     * Fetch articles list
     */
    async fetchArticles(params: ArticlesQueryParams = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response: PaginatedResponse<ArticleListItem> = await articlesApi.getList(params)
        this.articles = response.data
        this.pagination = {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          hasNext: response.hasNext,
          hasPrev: response.hasPrev,
        }
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        } else {
          this.error = 'Failed to fetch articles'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch article by ID
     */
    async fetchArticle(id: number) {
      this.isLoading = true
      this.error = null

      try {
        const article = await articlesApi.getById(id)
        this.currentArticle = article
        return article
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        } else {
          this.error = 'Failed to fetch article'
        }
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch related articles
     */
    async fetchRelatedArticles(id: number, limit = 4) {
      try {
        const articles = await articlesApi.getRelated(id, limit)
        this.relatedArticles = articles
      } catch {
        // Ignore errors for related articles
        this.relatedArticles = []
      }
    },

    /**
     * Create article
     */
    async createArticle(data: Parameters<typeof articlesApi.create>[0]) {
      this.isLoading = true
      this.error = null

      try {
        const article = await articlesApi.create(data)
        return article
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
     * Update article
     */
    async updateArticle(id: number, data: Parameters<typeof articlesApi.update>[1]) {
      this.isLoading = true
      this.error = null

      try {
        const article = await articlesApi.update(id, data)
        if (this.currentArticle?.id === id) {
          this.currentArticle = article
        }
        return article
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
     * Delete article
     */
    async deleteArticle(id: number) {
      this.isLoading = true
      this.error = null

      try {
        await articlesApi.delete(id)
        this.articles = this.articles.filter((a) => a.id !== id)
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
     * Like article
     */
    async likeArticle(id: number) {
      try {
        const result = await articlesApi.like(id)
        if (this.currentArticle?.id === id) {
          this.currentArticle.likeCount = result.likeCount
        }
        return result.likeCount
      } catch {
        return null
      }
    },

    /**
     * Clear current article
     */
    clearCurrentArticle() {
      this.currentArticle = null
      this.relatedArticles = []
    },

    /**
     * Reset store
     */
    reset() {
      this.articles = []
      this.currentArticle = null
      this.relatedArticles = []
      this.pagination = {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }
      this.error = null
    },
  },
})
