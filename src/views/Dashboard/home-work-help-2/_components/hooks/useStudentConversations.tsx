import { useQuery } from '@tanstack/react-query';
import { fetchStudentConversations } from '../../../../../services/AI';

function useStudentConversations({ studentId, ...options }) {
  const { data, isLoading, isError, isFetching, ...rest } = useQuery({
    queryKey: ['chatHistory', { studentId }],
    queryFn: () => fetchStudentConversations(studentId),
    refetchOnWindowFocus: false,
    ...options
  });

  return { data: data ?? [], isLoading, isError, isFetching, ...rest };
}

export default useStudentConversations;
