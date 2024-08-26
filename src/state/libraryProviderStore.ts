import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibraryProviderData } from '../types';
import { create } from 'zustand';

type Store = {
  libraryProviders: LibraryProviderData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchLibraryProviders: (queryParams?: SearchQueryParams) => Promise<void>;
};

export default create<Store>((set) => ({
  libraryProviders: null,
  isLoading: false,
  pagination: { limit: 30, page: 1, count: 100 },

  fetchLibraryProviders: async (queryParams?: SearchQueryParams) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 30;
      set({ isLoading: true });
      const response = await ApiService.getLibraryProviders(params);
      const { data, meta } = await response.json();

      set({ libraryProviders: data, pagination: meta?.pagination });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));
