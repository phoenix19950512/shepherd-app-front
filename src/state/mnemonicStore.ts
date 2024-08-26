import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type MnemonicData = {
  student: string;
  prompt: string;
  answer: string;
  explanation: string;
  subject?: string;
};

type Store = {
  mnemonics: MnemonicData[] | null;
  subjects: string[];
  isLoading: boolean;
  pagination: Pagination;
  fetchMnemonics: (queryParams?: SearchQueryParams) => Promise<void>;
  mnemonic?: MnemonicData | null;
  storeMnemonic: (data: MnemonicData) => Promise<Response | undefined>;
  //   deleteMnemonic: (id: string) => Promise<boolean>;
};

export default create<Store>((set) => ({
  mnemonics: null,
  isLoading: false,
  subjects: [],
  pagination: { limit: 10, page: 1, count: 100 },

  fetchMnemonics: async (queryParams?: SearchQueryParams) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getMnemonics(params);
      const { data, meta } = await response.json();

      set((prev) => {
        const d: any = {
          mnemonics: data,
          pagination: meta?.pagination
        };
        if (!prev.subjects.length) {
          d.subjects = meta?.subjects;
        }
        return { ...d };
      });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  },

  storeMnemonic: async (data: MnemonicData) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createMnemonic(data);
      if (response.status === 200) {
        const { data } = await response.json();
        set((store) => {
          const { mnemonics } = store;
          mnemonics?.push(data);
          return { mnemonics };
        });
      }
      return response;
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }

  //   deleteMnemonic: async (id: string) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.deleteMnemonic(id);
  //       if (response.status === 200) {
  //         set((state) => {
  //           const { mnemonics } = state;
  //           const index = mnemonics?.findIndex((mnemonic) => mnemonic._id === id);
  //           if (index !== undefined && index >= 0 && mnemonics) {
  //             mnemonics.splice(index, 1);
  //           }
  //           return { mnemonics };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   }
}));
