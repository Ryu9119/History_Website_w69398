import { useQuery } from '@tanstack/react-query';
import { 
  getAdminStatsWithToggle, 
  getAdminProductsWithToggle,
  AdminStats,
  AdminProduct 
} from '../lib/mock-admin';

export const useAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: ['admin-stats'],
    queryFn: getAdminStatsWithToggle,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: true, // Always enabled for admin stats
  });
};

export const useAdminProducts = () => {
  return useQuery<AdminProduct[], Error>({
    queryKey: ['admin-products'],
    queryFn: getAdminProductsWithToggle,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: true, // Always enabled for admin products
  });
};
