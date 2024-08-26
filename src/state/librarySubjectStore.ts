import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibrarySubjectData } from '../types';
import { create } from 'zustand';

type Store = {
  librarySubjects: LibrarySubjectData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchLibrarySubjects: (
    providerId: string,
    queryParams?: SearchQueryParams
  ) => Promise<void>;
  librarySubject?: LibrarySubjectData | null;
};

export default create<Store>((set) => ({
  librarySubjects: null,
  isLoading: false,
  pagination: { limit: 30, page: 1, count: 100 },

  fetchLibrarySubjects: async (
    providerId: string,
    queryParams?: SearchQueryParams
  ) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 30;
      set({ isLoading: true });
      const response = await ApiService.getLibrarySubjects({
        providerId,
        ...params
      });
      const { data, meta } = await response.json();

      set({ librarySubjects: data, pagination: meta?.pagination });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));
