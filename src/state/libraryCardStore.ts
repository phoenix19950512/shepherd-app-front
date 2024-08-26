import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibraryCardData } from '../types';
import { create } from 'zustand';

type Store = {
  libraryCards: LibraryCardData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchLibraryCards: (
    deckId: string,
    difficulty: string,
    page: number,
    limit?: number
  ) => Promise<void>;
  libraryCard?: LibraryCardData | null;
};

export default create<Store>((set, get) => ({
  libraryCards: null,
  isLoading: false,
  pagination: { limit: 20, page: 1, count: 0 },

  fetchLibraryCards: async (
    deckId: string,
    difficulty: string,
    page: number,
    limit = 20
  ) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getLibraryCards({
        deckId,
        difficulty,
        page,
        limit
      });
      const { data, meta } = await response.json();

      set((state) => ({
        libraryCards: page === 1 ? data : [...state.libraryCards, ...data],
        pagination: {
          ...state.pagination,
          page,
          count: meta?.pagination?.count
        }
      }));
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));
