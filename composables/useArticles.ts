import type { Article, PaginatedResponse } from '~/types'

export const useArticles = () => {
  const api = useApi()
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchArticles = async (params: {
    page?: number
    pageSize?: number
    category?: string
    tag?: string
    keyword?: string
    status?: string
  } = {}) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post<PaginatedResponse<Article>>('/articles', params)
      
      if (response.code === 0) {
        articles.value = response.data.items
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (e) {
      error.value = '获取文章列表失败'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchArticle = async (id: number | string) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post<Article>(`/articles/${id}`)
      
      if (response.code === 0) {
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (e) {
      error.value = '获取文章详情失败'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    articles,
    loading,
    error,
    fetchArticles,
    fetchArticle,
  }
}
