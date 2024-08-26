import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibraryDeckData } from '../types';
import { create } from 'zustand';

type Store = {
  libraryDecks: LibraryDeckData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchlibraryDecks: (
    subjectId: string,
    queryParams?: SearchQueryParams
  ) => Promise<void>;
  libraryDeck?: LibraryDeckData | null;
};

export default create<Store>((set) => ({
  libraryDecks: null,
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },

  fetchlibraryDecks: async (
    topicId: string,
    queryParams?: SearchQueryParams
  ) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });

      const response = await ApiService.getLibraryDecks({
        topicId,
        ...params
      });
      const { data, meta } = await response.json();

      set({ libraryDecks: data, pagination: meta?.pagination });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));
