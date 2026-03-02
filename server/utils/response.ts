import type { ApiResponse } from '~/types'

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  }
}

export function errorResponse(message: string, code = 1): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
  }
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): ApiResponse<{
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  return successResponse({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}
