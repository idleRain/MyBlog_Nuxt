import type { DashboardStats } from '~/types'

export default defineEventHandler(async (): Promise<DashboardStats> => {
  // Mock stats
  return {
    articleCount: 45,
    viewCount: 12580,
    commentCount: 234,
    userCount: 128,
    articleGrowth: 12.5,
    viewGrowth: 25.3,
    commentGrowth: 8.7,
    userGrowth: 15.2,
  }
})
