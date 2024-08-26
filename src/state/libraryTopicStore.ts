import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibraryTopicData } from '../types';
import { create } from 'zustand';

type Store = {
  libraryTopics: LibraryTopicData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchlibraryTopics: (
    subjectId: string,
    queryParams?: SearchQueryParams
  ) => Promise<void>;
  libraryTopic?: LibraryTopicData | null;
};

export default create<Store>((set) => ({
  libraryTopics: null,
  isLoading: false,
  pagination: { limit: 30, page: 1, count: 100 },

  fetchlibraryTopics: async (
    subjectId: string,
    queryParams?: SearchQueryParams
  ) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 30;
      set({ isLoading: true });

      const response = await ApiService.getLibraryTopics({
        subjectId,
        ...params
      });
      const { data, meta } = await response.json();

      set({ libraryTopics: data, pagination: meta?.pagination });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));
