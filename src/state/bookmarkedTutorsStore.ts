import ApiService from '../services/ApiService';
import { BookmarkedTutor } from '../types';
import { create } from 'zustand';

type Store = {
  tutors: Array<BookmarkedTutor>;
  tutorReviews: any;
  fetchBookmarkedTutors: () => Promise<void>;
  pagination: { page: number; limit: number; total: number };
  fetchTutorReviews: (id: string) => Promise<void>;
};

export default create<Store>((set) => ({
  tutors: [],
  tutorReviews: [],
  pagination: { page: 0, limit: 0, total: 0 },
  fetchBookmarkedTutors: async () => {
    const response = await ApiService.getBookmarkedTutors();
    const resp = await response.json();

    set({ tutors: resp.data.data, pagination: resp.data.meta.pagination });
  },
  fetchTutorReviews: async (id) => {
    const response = await ApiService.getTutorReviews(id);
    const resp = await response.json();

    set({ tutorReviews: resp });
  }
}));
// type Store = {
//   tutors: Array<BookmarkedTutor>;
//   totalCount: number;
//   currentPage: number;
//   fetchBookmarkedTutors: (page: number) => Promise<void>;
// };

// export default create<Store>((set) => ({
//   tutors: [],
//   totalCount: 0,
//   currentPage: 1,
//   fetchBookmarkedTutors: async (page: number) => {
//     const response = await ApiService.getBookmarkedTutors(page);
//     const { data, count } = await response.json();
//     set({ tutors: data, totalCount: count, currentPage: page });
//   },
// }));
