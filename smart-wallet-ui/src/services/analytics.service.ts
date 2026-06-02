import api from '../api/axiosConfig'
import type { ChartDataPoint, DashboardStatsResponse } from '../api/types'

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get<DashboardStatsResponse>('/v1/analytics/stats')
  return response.data
}

export const getDashboardChart = async (): Promise<ChartDataPoint[]> => {
  const response = await api.get<ChartDataPoint[]>('/v1/analytics/chart')
  return response.data
}