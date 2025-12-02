import { useQuery } from '@tanstack/react-query';
import { getDailyAnalysis } from '../../api/analysis';

export const useGetDailyAnalysis = () => {
  return useQuery({
    queryKey: ['dailyAnalysis'],
    queryFn: getDailyAnalysis,
  });
};
