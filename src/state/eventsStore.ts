import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type EventsStore = {
  events: any[];
  studyPlanResources: any[];
  tags: string[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  fetchEvents: () => Promise<void>;
};

export default create<EventsStore>((set) => ({
  events: [],
  studyPlanResources: [],
  tags: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, total: 100 },

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getCalendarEvents();
      const { data } = await response.json();

      set({ events: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  }

  //   fetchPlanResources: async (planId: string) => {
  //     set({ isLoading: true });
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.getStudyPlanResources(planId);
  //       const { data } = await response.json();

  //       set({ studyPlanResources: data });
  //       return data;
  //     } catch (error) {
  //       // console.log(error)
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },

  //   createStudyPlan: async (data: any) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.createStudyPlan(data);
  //       if (response.status === 200) {
  //         const newPlan = await response.json();
  //         set((state) => ({
  //           ...state,
  //           studyPlans: [...state.studyPlans, newPlan]
  //         }));
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
