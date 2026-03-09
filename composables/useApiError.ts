import { ApiError } from '~/services/api'

export interface UseApiErrorOptions {
  /**
   * Whether to show toast notifications
   */
  showToast?: boolean
  /**
   * Custom error messages
   */
  messages?: Record<number, string>
}

/**
 * Composable for handling API errors
 */
export function useApiError(options: UseApiErrorOptions = {}) {
  const { showToast = true, messages = {} } = options

  const error = shallowRef<string | null>(null)
  const statusCode = shallowRef<number | null>(null)
  const errors = shallowRef<Record<string, string[]> | null>(null)

  /**
   * Default error messages
   */
  const defaultMessages: Record<number, string> = {
    400: 'Invalid request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    408: 'Request timeout',
    409: 'Conflict',
    422: 'Validation error',
    429: 'Too many requests',
    500: 'Server error',
    502: 'Bad gateway',
    503: 'Service unavailable',
  }

  /**
   * Handle error
   */
  const handleError = (err: unknown) => {
    // Reset state
    error.value = null
    statusCode.value = null
    errors.value = null

    if (err instanceof ApiError) {
      statusCode.value = err.statusCode
      error.value = messages[err.statusCode] || err.message || defaultMessages[err.statusCode] || 'An error occurred'
      errors.value = err.errors

      if (showToast) {
        // TODO: Show toast notification
        console.error(`[API Error ${err.statusCode}]`, err.message)
      }
    } else if (err instanceof Error) {
      error.value = err.message

      if (showToast) {
        console.error('[Error]', err.message)
      }
    } else {
      error.value = 'An unexpected error occurred'

      if (showToast) {
        console.error('[Unknown Error]', err)
      }
    }

    return error.value
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
    statusCode.value = null
    errors.value = null
  }

  /**
   * Check if error is a specific status code
   */
  const isStatus = (code: number) => statusCode.value === code

  /**
   * Get field error
   */
  const getFieldError = (field: string): string | undefined => {
    return errors.value?.[field]?.[0]
  }

  return {
    error,
    statusCode,
    errors,
    handleError,
    clearError,
    isStatus,
    getFieldError,
  }
}
