import { serverAxios } from '@/lib/server-axios';
import { OverviewStats } from '@/types/stats';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
}

export const serverStatsApi = {
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response =
      await serverAxios.get<ApiResponse<OverviewStats>>('/stats');
    return response.data.data;
  }
};
