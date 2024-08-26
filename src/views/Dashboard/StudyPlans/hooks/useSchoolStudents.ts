import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../services/ApiService';
import { UserType } from '../../../../types';

const useSchoolStudents = (
  filterParams: Record<string, any> = {},
  pagination?: { page: number; limit: number }
) => {
  const { page, limit } = pagination || {};
  const query = useQuery<{ user: UserType }[]>({
    queryKey: ['schoolStudents', page, limit, filterParams],
    queryFn: async () => {
      const response = await ApiService.getSchoolTutorStudents(
        page,
        limit,
        filterParams
      );
      const { data } = await response.json();
      return data;
    }
  });

  return query;
};

export default useSchoolStudents;
